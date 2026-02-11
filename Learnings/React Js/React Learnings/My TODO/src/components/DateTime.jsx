import { useEffect, useState } from "react";

export function DateTime() {
  const [timeDate, setTimeDate] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();
      setTimeDate(`${date} - ${time}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <h2 className="date-time">{timeDate}</h2>;
}
    