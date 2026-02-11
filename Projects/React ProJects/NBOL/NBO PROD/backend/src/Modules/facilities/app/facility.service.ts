import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Rooms } from '../model/rooms.model';
import { createFacility } from '../dto/createFacility';
import { CreationAttributes, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as XLSX from 'xlsx';
import { Facilities } from '../model/facility.model';
import { UpdateFacility } from '../dto/updateFacility';
import { isNotEmpty } from 'class-validator';
import { getSearchObject } from 'src/common/helpers/getSearchObject.helper';
import { RequestParamsService } from 'src/Modules/requestParams';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';

@Injectable()
export class FacilityService {
  constructor(
    private sequelize: Sequelize,

    @InjectModel(Facilities)
    private facilityModel: typeof Facilities,

    @InjectModel(Rooms)
    private roomModel: typeof Rooms,

    @InjectModel(Class)
    private classModel: typeof Class,

    @InjectModel(ParticipantsAssessments)
    private participantsAssessmentsModel: typeof ParticipantsAssessments,

    private readonly requestParams: RequestParamsService,
  ) {}

  download() {
    try {
      const fileName = 'facility_data.xlsx';
      return {
        fileName,
        filePath: 'public/excel/facility_data.xlsx',
      };
    } catch (error) {
      throw new Error(`Failed To Download Excel File: ${error.message}`);
    }
  }

  async processExcelFile(
    clientId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      jsonData.forEach((item, idx) => {
        const reqFields = [
          'Facility Name',
          'Address',
          'Room 1',
          // 'Room 2',
          // 'Room 3',
        ];
        for (const field of reqFields) {
          if (!item[field] || item[field].toString().trim() === '') {
            throw new HttpException(
              {
                status: 400,
                success: false,
                message: `Row ${idx + 2}: Field ${field} Is Missing Or Empty. Please Fill All The Fields.`,
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      });

      const normalizedData = jsonData.map((item) => ({
        facility_name: item['Facility Name'],
        address: item['Address'],
        room1: item['Room 1'],
        room2: item['Room 2'],
        room3: item['Room 3'],
        room4: item['Room 4'],
        room5: item['Room 5'],
        room6: item['Room 6'],
        room7: item['Room 7'],
        room8: item['Room 8'],
        room9: item['Room 9'],
      }));

      const facilityMap = new Map<
        string,
        { facility_name: string; address: string; client_id: string }
      >();
      const rooms: {
        room_name: string;
        facility_name: string;
        address: string;
      }[] = [];

      normalizedData.forEach((item) => {
        const facilityKey = `${item.facility_name}-${item.address}`;

        if (!facilityMap.has(facilityKey)) {
          facilityMap.set(facilityKey, {
            facility_name: item.facility_name,
            address: item.address,
            client_id: clientId,
          });
        }

        Object.keys(item).forEach((key) => {
          if (key.toLowerCase().startsWith('room') && item[key]) {
            rooms.push({
              room_name: item[key],
              facility_name: item.facility_name,
              address: item.address,
            });
          }
        });
      });

      const facilitiesArray = Array.from(facilityMap.values());

      //--------------------------
      for (const facility of facilitiesArray) {
        const existingFacility = await this.facilityModel.findOne({
          where: {
            [Op.and]: [
              { facility_name: facility.facility_name },
              { client_id: clientId },
            ],
          },
          // transaction,
        });

        if (existingFacility) {
          throw new HttpException(
            `A Facility With The Name "${facility.facility_name}" Already Exists For This Client.`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      const facilitiesWithoutRooms = facilitiesArray.filter((facility) =>
        rooms.every(
          (room) =>
            room.facility_name !== facility.facility_name ||
            room.address !== facility.address,
        ),
      );

      if (facilitiesWithoutRooms.length > 0) {
        throw new Error(
          `The Following Facilities Do Not Have Any Associated Rooms. ${facilitiesWithoutRooms
            .map((facility) => facility.facility_name)
            .join(', ')}`,
        );
      }

      const facilityRoomMap = new Map<string, Set<string>>();
      rooms.forEach((room) => {
        const facilityKey = `${room.facility_name}-${room.address}`;
        if (!facilityRoomMap.has(facilityKey)) {
          facilityRoomMap.set(facilityKey, new Set());
        }
        let roomSet = facilityRoomMap.get(facilityKey);
        if (!roomSet) {
          roomSet = new Set();
          facilityRoomMap.set(facilityKey, roomSet);
        }
        if (roomSet.has(room.room_name)) {
          throw new HttpException(
            `Duplicate Room Name "${room.room_name}" Found In Facility "${room.facility_name}"`,
            HttpStatus.BAD_REQUEST,
          );
        }
        roomSet.add(room.room_name);
      });

      // ---------------------------------

      const savedFacilities = await this.facilityModel.bulkCreate(
        facilitiesArray as CreationAttributes<Facilities>[],
        {
          returning: true,
        },
      );

      const facilityIdMap = new Map<string, string>();
      savedFacilities.forEach((facility: any) => {
        facilityIdMap.set(
          `${facility.facility_name}-${facility.address}`,
          facility.id,
        );
      });

      const roomsWithFacilityId: CreationAttributes<Rooms>[] = rooms.map(
        (room) =>
          ({
            room: room.room_name,
            facility_id:
              facilityIdMap.get(`${room.facility_name}-${room.address}`) ||
              null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }) as unknown as CreationAttributes<Rooms>,
      );

      await this.roomModel.bulkCreate(roomsWithFacilityId);

      return 'Facility Details Uploaded Successfully';
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: `${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createFacility(
    clientId: string,
    facilityData: createFacility,
  ): Promise<Facilities> {
    return await this.sequelize.transaction(async (transaction) => {
      const existingFacility = await this.facilityModel.findOne({
        where: {
          [Op.and]: [
            { facility_name: facilityData.facility_name.trim() },
            { client_id: clientId },
          ],
        },
        transaction,
      });

      if (existingFacility) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: `A Facility With This Name Already Exists For This Client.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const roomNames = facilityData.rooms.map((room) => room.room.trim());
      const duplicateRooms = roomNames.filter(
        (room, index) => roomNames.indexOf(room) !== index,
      );

      if (duplicateRooms.length > 0) {
        throw new HttpException(
          {
            status: 400,
            success: false,

            message: `Room ${[...new Set(duplicateRooms)].join(', ')} is already in use. Please enter a unique room.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const facility = await this.facilityModel.create(
        {
          facility_name: facilityData.facility_name,
          address: facilityData.address,
          // projectId: projectId,
          client_id: clientId,
        } as Facilities,
        { transaction },
      );

      const facilityRoom: CreationAttributes<Rooms>[] = facilityData.rooms.map(
        (froom, idx): CreationAttributes<Rooms> =>
          ({
            room: froom.room,
            facility_id: facility.id,
            sequence: idx,
          }) as CreationAttributes<Rooms>,
      );
      await this.roomModel.bulkCreate(facilityRoom, { transaction });
      return facility;
    });
  }

  async clientAllFacilities(
    clientId: string,
    page: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const offset = page * limit;

    // const record = await this.facilityModel.count();

    const facility = await this.facilityModel.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        client_id: clientId,
        ...getSearchObject(this.requestParams.query, [
          'facility_name',
          'address',
        ]),
      },
      offset: offset,
      limit: limit,
      include: [
        {
          model: Rooms,
          as: 'room',
          separate: true,
          order: [['sequence', 'ASC']],
        },
      ],
    });
    if (facility.length <= 0) {
      throw new HttpException({
        message: "Facilities not found"
      }, HttpStatus.NOT_FOUND)
    }

    return {
      rows: facility,
      count: await this.facilityModel.count({
        where: {
          client_id: clientId,
        },
      }),
      page: page,
    };
  }

  async updateFacility(
    facility_id: string,
    updatefacility: UpdateFacility,
  ): Promise<Facilities> {
    return await this.sequelize.transaction(async (transaction) => {
      // const classFacility = await this.classModel.findAll({
      //   where: {
      //     facility_id: facility_id,
      //   },
      // });
      // if (classFacility.length > 0) {
      //   throw new HttpException(
      //     {
      //       status: 400,
      //       success: false,
      //       message: 'You Cannot Update Facility Which Is Used In NBO CLASS',
      //     },
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }
      const facility = await this.facilityModel.findByPk(facility_id, {
        transaction,
      });
      if (!facility) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: 'Facility Not Found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (updatefacility.facility_name) {
        (facility.facility_name = updatefacility.facility_name),
          await facility.save({ transaction });
      }
      if (updatefacility.address) {
        (facility.address = updatefacility.address),
          await facility.save({ transaction });
      }
      //================= Rooms========
      // if (updatefacility.rooms && updatefacility.rooms.length > 0) {
      //   await this.roomModel.destroy({
      //     where: { facility_id },
      //     transaction,
      //   });
      //   const facilityRoom: CreationAttributes<Rooms>[] =
      //     updatefacility.rooms.map(
      //       (froom): CreationAttributes<Rooms> =>
      //         ({
      //           room: froom.room,
      //           facility_id: facility.id,
      //         }) as CreationAttributes<Rooms>,
      //     );
      //   await this.roomModel.bulkCreate(facilityRoom, { transaction });
      // }

      // Room Duplication Check.
      const roomNames = updatefacility.rooms.map((room) => room.room.trim());
      const duplicateRooms = roomNames.filter(
        (room, index) => roomNames.indexOf(room) !== index,
      );

      if (duplicateRooms.length > 0) {
        throw new HttpException(
          {
            status: 400,
            success: false,
            message: `Room ${[...new Set(duplicateRooms)].join(', ')} is already in use. Please enter a unique room.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (updatefacility.rooms && updatefacility.rooms.length > 0) {
        const existingRooms = updatefacility.rooms.filter((r) => r.room_id);
        const newRooms = updatefacility.rooms.filter((r) => !r.room_id);

        if (existingRooms.length > 0) {
          await this.roomModel.bulkCreate(
            existingRooms.map(
              (r) =>
                ({
                  id: r.room_id,
                  room: r.room,
                  facility_id: facility.id,
                }) as CreationAttributes<Rooms>,
            ),
            {
              updateOnDuplicate: ['room', 'facility_id'],
              transaction,
            },
          );
        }

        if (newRooms.length > 0) {
          await this.roomModel.bulkCreate(
            newRooms.map(
              (r) =>
                ({
                  room: r.room,
                  facility_id: facility.id,
                }) as CreationAttributes<Rooms>,
            ),
            { transaction },
          );
        }
      }

      return facility;
    });
  }

  async deleteFacility(facilityId: string): Promise<any> {
    const classFacility = await this.classModel.findAll({
      where: {
        facility_id: facilityId,
      },
    });
    if (classFacility.length > 0) {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Cannot delete the facility linked to an active NBO CLASS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const facility = await this.facilityModel.findByPk(facilityId);
    if (facility) {
      await facility.destroy();
      return {
        message: 'Facility Deletd Successfully',
      };
    } else {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Facility Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async faciityRooms(facilityId: string): Promise<any> {
    const facilityRooms = await this.roomModel.findAll({
      where: {
        facility_id: facilityId,
      },
    });
     if (facilityRooms.length <= 0) {
      throw new HttpException({
        message: "Facility rooms not found"
      }, HttpStatus.NOT_FOUND)
    }
    return {
      rows: facilityRooms,
    };
  }

  async deleteRoom(roomId: string): Promise<any> {
    const room = await this.roomModel.findOne({
      where: {
        id: roomId,
      },
      include: [
        {
          model: this.participantsAssessmentsModel,
          as: 'participants_assessments',
          attributes: [],
          required: true,
        },
      ],
    });
    const deleteRoom = await this.roomModel.findByPk(roomId);
    if (!deleteRoom) {
      throw new HttpException(
        {
          message: 'Room Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (!room) {
      await deleteRoom?.destroy();
      return 'Room Deleted Successfully';
    } else {
      throw new HttpException(
        {
          status: 400,
          success: false,
          message: 'Deletion Failed: Room Is Used In NBO CLASS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
