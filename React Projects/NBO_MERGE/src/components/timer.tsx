import { useEffect, useRef, useState } from "react";

const Timer = ({ playSound }: { playSound: boolean }) => {
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timesPlayed, SetTimessPlayed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const play = () => {
    const audio = new Audio(
      "/music/mixkit-vintage-warning-alarm-990_8OsRuhfH.wav",
    );
    if (timesPlayed === 1) {
      audio.play();
    }
  };

  const startTimer = () => {
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds > 0) {
      setRemaining(totalSeconds);
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            stopTimer();
            play();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className='p-4 flex gap-5 items-center text-center'>
      {!isRunning && (
        <div className='flex gap-2 items-center'>
          <select
            className='border p-2 rounded'
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {i} min
              </option>
            ))}
          </select>

          <select
            className='border p-2 rounded'
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {i} sec
              </option>
            ))}
          </select>
        </div>
      )}

      {isRunning && (
        <div className='text-2xl font-mono'>{formatTime(remaining)}</div>
      )}

      {!isRunning && (
        <button
          className='px-4 py-2 bg-green-500 text-white rounded'
          onClick={() => {
            startTimer();
            SetTimessPlayed((prev) => prev + 1);
          }}
          disabled={isRunning || (minutes === 0 && seconds === 0)}
        >
          Start
        </button>
      )}
    </div>
  );
};

export default Timer;
