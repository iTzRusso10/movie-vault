import React from "react";

interface CircularProgressProps {
  percentage: number; // Valore da 0 a 100
  size?: number; // Dimensione del cerchio
  strokeWidth?: number; // Spessore del bordo
}

export const MovieAverage = ({
  percentage,
  size = 100,
  strokeWidth = 10,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  let backgroundColor: string;
  let color: string;
  if (percentage < 49) {
    color = "#ff0000";
    backgroundColor = "rgba(255, 0, 0, 0.2)";
  } else if (percentage < 79) {
    color = "#ffbf00";
    backgroundColor = "rgba(255, 191, 0, 0.2)";
  } else {
    color = "#00ff00";
    backgroundColor = "rgba(0, 255, 0, 0.2)";
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 overflow-visible bg-black rounded-full"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div
        className="absolute text-white font-bold flex items-center justify-center text-xs"
        style={{ width: size, height: size }}
      >
        {Math.round(percentage)}%
      </div>
    </div>
  );
};
