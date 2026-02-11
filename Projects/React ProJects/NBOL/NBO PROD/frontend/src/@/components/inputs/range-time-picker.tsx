import { useField, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TiArrowRight } from "react-icons/ti";
import { Label } from "../label";
import { Input } from "../ui/input";

interface TimeRangePickerProps {
  startTimeName: any;
  endTimeName: any;
  label?: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
  onTimeChange?: any;
  disabled?: boolean;
  timeIntervals?: number;
  minTime?: Date;
  maxTime?: Date;
}

export default function TimeRangePicker({
  startTimeName,
  endTimeName,
  label,
  defaultStartTime,
  defaultEndTime,
  onTimeChange,
  disabled = false,
  timeIntervals = 30,
  minTime,
  maxTime,
}: TimeRangePickerProps) {
  // console.log(minTime, maxTime, "minTime, maxTime");
  const { setFieldValue } = useFormikContext();
  const [fieldStart, metaStart] = useField(startTimeName);
  const [fieldEnd, metaEnd] = useField(endTimeName);

  const convertToTime = (
    time: string | Date | null | undefined,
  ): Date | null => {
    if (!time) return null;

    if (time instanceof Date && !isNaN(time.getTime())) return time;

    if (typeof time === "string") {
      const date = new Date(time);
      if (!isNaN(date.getTime())) return date;

      const [hoursStr, minutesStr] = time.split(":");
      const hours = Number(hoursStr);
      const minutes = Number(minutesStr);

      if (
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
      ) {
        return null;
      }

      const fallbackDate = new Date();
      fallbackDate.setHours(hours, minutes, 0, 0);
      return fallbackDate;
    }

    return null;
  };

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    if (fieldStart.value) {
      const converted = convertToTime(fieldStart.value);
      setStartTime(converted);
    }
  }, [fieldStart.value]);

  useEffect(() => {
    if (fieldEnd.value) {
      const converted = convertToTime(fieldEnd.value);
      setEndTime(converted);
    }
  }, [fieldEnd.value]);

  useEffect(() => {
    if (defaultStartTime) {
      setStartTime(convertToTime(defaultStartTime));
    }
    if (defaultEndTime) {
      setEndTime(convertToTime(defaultEndTime));
    }
  }, [defaultStartTime, defaultEndTime]);

  useEffect(() => {
    if (!fieldStart.value && startTime) {
      setFieldValue(startTimeName, startTime);
    }
    if (!fieldEnd.value && endTime) {
      setFieldValue(endTimeName, endTime);
    }
  }, [
    startTime,
    endTime,
    fieldStart.value,
    fieldEnd.value,
    setFieldValue,
    startTimeName,
    endTimeName,
  ]);

  return (
    <div className='flex flex-col justify-center '>
      <Label>{label}</Label>
      <div className='flex items-center justify-center space-x-1'>
        <DatePicker
          selected={startTime}
          onChange={(date) => {
            setStartTime(date);
            if (date) {
              const start = new Date(date);
              const autoEnd = new Date(
                start.getTime() + timeIntervals * 60 * 1000,
              ); // add interval

              setEndTime(autoEnd);

              setFieldValue(startTimeName, start.toISOString());
              setFieldValue(endTimeName, autoEnd.toISOString());

              onTimeChange?.({ date, autoEnd });
            }
          }}
          disabled={disabled}
          showTimeSelect
          timeIntervals={timeIntervals}
          showTimeSelectOnly
          timeFormat='hh:mm aa'
          timeCaption='Start Time'
          dateFormat='hh:mm aa'
          customInput={
            <Input
              className='w-28 text-center'
              {...fieldStart}
              placeholder='Start Time'
            />
          }
          minTime={minTime ?? new Date(new Date().setHours(0, 0, 0, 0))}
          maxTime={maxTime ?? new Date(new Date().setHours(23, 59, 59, 999))}
        />

        <TiArrowRight />
        <DatePicker
          selected={endTime}
          onChange={(date) => {
            setEndTime(date);
            if (date) {
              setFieldValue(endTimeName, new Date(date).toISOString());
              onTimeChange?.(date);
            }
          }}
          disabled={disabled || !startTime}
          showTimeSelect
          timeIntervals={timeIntervals}
          showTimeSelectOnly
          timeFormat='hh:mm aa'
          timeCaption='End Time'
          dateFormat='hh:mm aa'
          customInput={
            <Input
              className='w-28 text-center'
              {...fieldEnd}
              placeholder='End Time'
            />
          }
          minTime={
            startTime
              ? new Date(startTime.getTime() + 1 * 60 * 1000)
              : (minTime ?? new Date(new Date().setHours(0, 0, 0, 0)))
          }
          maxTime={maxTime ?? new Date(new Date().setHours(23, 59, 59, 999))}
        />
        {/* <DatePicker
          selected={endTime}
          onChange={(date) => {
            setEndTime(date);
            if (date) {
              setFieldValue(endTimeName, new Date(date).toISOString());
              onTimeChange?.(date);
            }
          }}
          disabled={disabled || !startTime}
          showTimeSelect
          timeIntervals={timeIntervals}
          showTimeSelectOnly
          timeFormat='hh:mm aa'
          timeCaption='End Time'
          dateFormat='hh:mm aa'
          customInput={
            <Input
              className='w-28 text-center'
              {...fieldEnd}
              placeholder='End Time'
            />
          }
          minTime={
            startTime
              ? new Date(startTime.getTime() + 1 * 60 * 1000)
              : (minTime ?? new Date(new Date().setHours(0, 0, 0, 0)))
          }
          maxTime={maxTime ?? new Date(new Date().setHours(23, 59, 59, 999))}
        /> */}
      </div>

      {metaStart.touched && metaStart.error && (
        <p className='text-red-500 text-sm'>{metaStart.error}</p>
      )}
      {metaEnd.touched && metaEnd.error && (
        <p className='text-red-500 text-sm'>{metaEnd.error}</p>
      )}
    </div>
  );
}
