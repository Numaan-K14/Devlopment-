import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import {
  AvailabilityMatrix,
  TimeSlot,
  SchedulingInput,
} from '../dto/scheduling.dto';
import { Class } from '../model/class.model';
import { ParticipantsAssessments } from '../model/participantAssessments.model';
import { ClassAssessors } from '../model/classPartAssessmAssessors.model';
import { Rooms } from '../../facilities/model/rooms.model';
import { GroupActivityRooms } from '../model/groupActivityRooms.model';

@Injectable()
export class AvailabilityMatrixBuilder {
  constructor(
    @InjectModel(Class) private classModel: typeof Class,
    @InjectModel(ParticipantsAssessments)
    private participantAssessmentsModel: typeof ParticipantsAssessments,
    @InjectModel(ClassAssessors)
    private classAssessorsModel: typeof ClassAssessors,
    @InjectModel(Rooms) private roomsModel: typeof Rooms,
    @InjectModel(GroupActivityRooms)
    private groupActivityRoomsModel: typeof GroupActivityRooms,
  ) {}

  /**
   * Extract unique assessor IDs from assessment_assessor_mapping
   * @param mapping Assessment to assessor mapping
   * @returns Array of unique assessor IDs
   */
  private extractAssessorsFromMapping(mapping: {
    [assessmentId: string]: string[];
  }): string[] {
    const assessorSet = new Set<string>();

    Object.values(mapping).forEach((assessorIds) => {
      assessorIds.forEach((assessorId) => {
        if (assessorId && assessorId.trim()) {
          assessorSet.add(assessorId);
        }
      });
    });

    const uniqueAssessors = Array.from(assessorSet);
    console.log(
      `Mapping contains ${Object.keys(mapping).length} assessments with ${uniqueAssessors.length} unique assessors`,
    );

    return uniqueAssessors;
  }

  async buildAvailabilityMatrix(
    input: SchedulingInput,
  ): Promise<AvailabilityMatrix> {
    const timeSlots = this.generateTimeSlots(input);

    // Extract unique assessor IDs from assessment mapping
    const assessorIds = input.assessment_assessor_mapping
      ? this.extractAssessorsFromMapping(input.assessment_assessor_mapping)
      : [];
    console.log(
      `Extracted ${assessorIds.length} unique assessors from mapping:`,
      assessorIds,
    );

    const [assessorAvailability, roomAvailability, participantAvailability] =
      await Promise.all([
        this.buildAssessorAvailability(assessorIds, timeSlots, input),
        this.buildRoomAvailability(input.facility_id, timeSlots, input),
        this.buildParticipantAvailability(
          input.participantIds,
          timeSlots,
          input,
        ),
      ]);

    return {
      assessors: assessorAvailability,
      rooms: roomAvailability,
      participants: participantAvailability,
      timeSlots,
    };
  }

  // private generateTimeSlots(input: SchedulingInput): TimeSlot[] {
  //   const slots: TimeSlot[] = [];
  //   const startTime = new Date(input.start_date);
  //   const endTime = new Date(input.end_date);
  //   const duration = input.duration_of_each_activity;

  //   let slotId = 0;
  //   let currentTime = new Date(startTime);

  //   while (currentTime < endTime) {
  //     const slotEndTime = new Date(
  //       currentTime.getTime() + duration * 60 * 1000,
  //     );

  //     // Skip lunch time slots
  //     if (!this.overlapsWithLunch(currentTime, slotEndTime, input.lunchTime)) {
  //       slots.push({
  //         id: `slot_${slotId++}`,
  //         startTime: new Date(currentTime),
  //         endTime: slotEndTime,
  //         duration,
  //       });
  //     }

  //     currentTime = new Date(
  //       currentTime.getTime() +
  //         (duration + 5) * 60 * 1000, // 5 minutes default break between activities
  //     );
  //   }

  //   return slots;
  // }

  private generateTimeSlots(input: SchedulingInput): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const startTime = new Date(input.start_date);
    const endTime = new Date(input.end_date);
    const duration = input.duration_of_each_activity;

    let slotId = 0;
    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const slotEndTime = new Date(
        currentTime.getTime() + duration * 60 * 1000,
      );

      const currentDate = currentTime.toISOString().split('T')[0];
      const todayBreaks = input.daily_breaks?.find(
        (b) => b.date === currentDate,
      );

      let overlapsLunch = false;
      if (todayBreaks) {
        overlapsLunch = this.overlapsWithLunch(currentTime, slotEndTime, {
          start_time: `${todayBreaks.date}T${todayBreaks.lunch_break_start_time}:00`,
          end_time: `${todayBreaks.date}T${todayBreaks.lunch_break_end_time}:00`,
        });
      }

      if (!overlapsLunch) {
        slots.push({
          id: `slot_${slotId++}`,
          startTime: new Date(currentTime),
          endTime: slotEndTime,
          duration,
        });
      }

      currentTime = new Date(
        currentTime.getTime() + duration * 60 * 1000, // No automatic break between activities
      );
    }

    return slots;
  }

  private overlapsWithLunch(
    slotStart: Date,
    slotEnd: Date,
    lunchTime: { start_time: Date | string; end_time: Date | string },
  ): boolean {
    return slotStart < lunchTime.end_time && lunchTime.start_time < slotEnd;
  }

  private async buildAssessorAvailability(
    assessorIds: string[],
    timeSlots: TimeSlot[],
    input: SchedulingInput,
  ): Promise<Map<string, Map<string, boolean>>> {
    const availability = new Map<string, Map<string, boolean>>();

    // Get existing commitments for assessors
    const existingCommitments = await this.participantAssessmentsModel.findAll({
      include: [
        {
          model: this.classModel,
          as: 'class',
          where: {
            start_date: { [Op.lte]: input.end_date },
            end_date: { [Op.gte]: input.start_date },
          },
        },
        {
          model: this.classAssessorsModel,
          as: 'class_assessors',
          where: {
            assessors_id: { [Op.in]: assessorIds },
          },
        },
      ],
    });

    // Initialize availability for all assessors and time slots
    for (const assessorId of assessorIds) {
      const assessorAvailability = new Map<string, boolean>();

      for (const timeSlot of timeSlots) {
        // Check if assessor has existing commitment during this time slot
        const hasConflict = existingCommitments.some((commitment) => {
          const commitmentStart = new Date(
            commitment.start_time || commitment.class.start_date,
          );
          const commitmentEnd = new Date(
            commitment.end_time || commitment.class.end_date,
          );

          return this.timeOverlaps(
            timeSlot.startTime,
            timeSlot.endTime,
            commitmentStart,
            commitmentEnd,
          );
        });

        assessorAvailability.set(timeSlot.id, !hasConflict);
      }

      availability.set(assessorId, assessorAvailability);
    }

    return availability;
  }

  private async buildRoomAvailability(
    facilityId: string,
    timeSlots: TimeSlot[],
    input: SchedulingInput,
  ): Promise<Map<string, Map<string, boolean>>> {
    const availability = new Map<string, Map<string, boolean>>();

    // Get all rooms in facility
    const rooms = await this.roomsModel.findAll({
      where: { facility_id: facilityId },
    });

    // Get existing room bookings
    const existingBookings = await this.participantAssessmentsModel.findAll({
      include: [
        {
          model: this.classModel,
          as: 'class',
          where: {
            start_date: { [Op.lte]: input.end_date },
            end_date: { [Op.gte]: input.start_date },
          },
        },
      ],
      where: {
        room_id: { [Op.in]: rooms.map((r) => r.id) },
      },
    });

    // Check group activity room bookings
    const groupBookings = await this.groupActivityRoomsModel.findAll({
      include: [
        {
          model: this.classModel,
          as: 'class',
          where: {
            start_date: { [Op.lte]: input.end_date },
            end_date: { [Op.gte]: input.start_date },
          },
        },
      ],
      where: {
        room_id: { [Op.in]: rooms.map((r) => r.id) },
      },
    });

    const allBookings = [...existingBookings, ...groupBookings];

    // Initialize availability for all rooms and time slots
    for (const room of rooms) {
      const roomAvailability = new Map<string, boolean>();

      for (const timeSlot of timeSlots) {
        // Check if room has existing booking during this time slot
        const hasConflict = allBookings.some((booking) => {
          if (booking.room_id !== room.id) return false;

          const bookingStart = new Date(
            booking.start_time || booking.class.start_date,
          );
          const bookingEnd = new Date(
            booking.end_time || booking.class.end_date,
          );

          return this.timeOverlaps(
            timeSlot.startTime,
            timeSlot.endTime,
            bookingStart,
            bookingEnd,
          );
        });

        roomAvailability.set(timeSlot.id, !hasConflict);
      }

      availability.set(room.id.toString(), roomAvailability);
    }

    return availability;
  }

  private async buildParticipantAvailability(
    participantIds: string[],
    timeSlots: TimeSlot[],
    input: SchedulingInput,
  ): Promise<Map<string, Map<string, boolean>>> {
    const availability = new Map<string, Map<string, boolean>>();

    // Get existing participant commitments
    const existingCommitments = await this.participantAssessmentsModel.findAll({
      include: [
        {
          model: this.classModel,
          as: 'class',
          where: {
            start_date: { [Op.lte]: input.end_date },
            end_date: { [Op.gte]: input.start_date },
          },
        },
      ],
      where: {
        participant_id: { [Op.in]: participantIds },
      },
    });

    // Initialize availability for all participants and time slots
    for (const participantId of participantIds) {
      const participantAvailability = new Map<string, boolean>();

      for (const timeSlot of timeSlots) {
        // Check if participant has existing commitment during this time slot
        const hasConflict = existingCommitments.some((commitment) => {
          if (commitment.participant_id !== participantId) return false;

          const commitmentStart = new Date(
            commitment.start_time || commitment.class.start_date,
          );
          const commitmentEnd = new Date(
            commitment.end_time || commitment.class.end_date,
          );

          return this.timeOverlaps(
            timeSlot.startTime,
            timeSlot.endTime,
            commitmentStart,
            commitmentEnd,
          );
        });

        participantAvailability.set(timeSlot.id, !hasConflict);
      }

      availability.set(participantId, participantAvailability);
    }

    return availability;
  }

  private timeOverlaps(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date,
  ): boolean {
    return start1 < end2 && start2 < end1;
  }
}
