// import { useEffect, useRef, useState } from "react";
// import { LuClock } from "react-icons/lu";

// interface CountdownTimerProps {
//   initialTime: number; // in seconds
//   isRunning: boolean; // control from outside
//   onComplete?: () => void; // optional callback
//   onTimeUpdate?: (remainingTime: number) => void; // ✅ new callback prop
// }

// export default function CountdownTimer({
//   initialTime,
//   isRunning,
//   onComplete,
//   onTimeUpdate,
// }: CountdownTimerProps) {
//   const [timeLeft, setTimeLeft] = useState(initialTime);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   // Reset time if initialTime changes
//   useEffect(() => {
//     setTimeLeft(initialTime);
//   }, [initialTime]);

//   // Handle start/stop based on external control
//   useEffect(() => {
//     if (isRunning && timeLeft > 0) {
//       timerRef.current = setInterval(() => {
//         setTimeLeft((prev) => {
//           const newTime = prev - 1;

//           // ✅ notify parent on every tick
//           onTimeUpdate?.(newTime);

//           if (newTime <= 0) {
//             clearInterval(timerRef.current!);
//             onComplete?.();
//             return 0;
//           }

//           return newTime;
//         });
//       }, 1000);
//     } else {
//       if (timerRef.current) clearInterval(timerRef.current);
//     }

//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [isRunning]);

//   const formatTime = (seconds: number) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };

//   return (
//     <div className='w-[74px] flex h-[24px] text-center items-center justify-between'>
//       <LuClock className='size-5' />
//       <div className='font-medium'>{formatTime(timeLeft)}</div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";

interface CountdownTimerProps {
  initialTime: number; // in seconds
  isRunning: boolean;
  onComplete?: () => void;
  onTimeUpdate?: (remainingTime: number) => void;
}

export default function CountdownTimer({
  initialTime,
  isRunning,
  onComplete,
  onTimeUpdate,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // console.log(initialTime, "<----- initialTime");
  // console.log(onTimeUpdate, "<---------- onTimeUpdate");
  const radius = 32;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = timeLeft / initialTime;
  const strokeDashoffset = circumference - progress * circumference;
  const isCompletedRef = useRef(false);

  useEffect(() => {
    setTimeLeft(initialTime);
    isCompletedRef.current = false;
  }, [initialTime]);
  // console.log(timeLeft, "<--- timeLeft");
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          onTimeUpdate?.(newTime);

          if (newTime <= 0) {
            clearInterval(timerRef.current!);
            if (!isCompletedRef.current) {
              isCompletedRef.current = true;
              onComplete?.();
            }
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className='relative flex items-center justify-center w-[64px] h-[64px]'>
      <svg
        height='64'
        width='64'
        className='transform -rotate-90'
        viewBox='0 0 64 64'
      >
        <circle
          stroke='#E6E6E6'
          fill='transparent'
          strokeWidth={stroke}
          r={normalizedRadius}
          cx='32'
          cy='32'
        />
        <circle
          stroke='#265BB8'
          fill='transparent'
          strokeWidth={stroke}
          strokeLinecap='round'
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.3s linear",
          }}
          r={normalizedRadius}
          cx='32'
          cy='32'
        />
      </svg>

      <div className='absolute text-[14px] leading-[20px] font-semibold text-[#414651]'>
        {formatTime(timeLeft)}
      </div>
    </div>
  );
}
