"use client";
import { useEffect, useState } from "react";

function LiveClock() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(new Date()); // set once on mount
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return null; // avoid SSR mismatch

  // helper to add "st", "nd", "rd", "th"
  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const weekday = time.toLocaleDateString("en-US", { weekday: "long" });
  const month = time.toLocaleDateString("en-US", { month: "long" });
  const year = time.getFullYear();
  const day = time.getDate();
  const dayWithSuffix = `${day}${getDaySuffix(day)}`;
  const timePart = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).replace(" ", ""); // removes space before AM/PM

  return (
    <span className='text-xs font-bold roboto text-black/70'>
      {`${weekday}, ${month} ${dayWithSuffix}, ${year}, ${timePart}`}
    </span>
  );
}

export default LiveClock;
