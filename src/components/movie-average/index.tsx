interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

function scorePalette(percentage: number): {
  stroke: string;
  track: string;
  label: string;
} {
  if (percentage < 49) {
    return {
      stroke: "var(--color-mv-ember-glow)",
      track: "rgba(158, 47, 61, 0.22)",
      label: "var(--color-mv-ember-glow)",
    };
  }
  if (percentage < 79) {
    return {
      stroke: "var(--color-mv-amber)",
      track: "rgba(201, 149, 108, 0.2)",
      label: "var(--color-mv-gold-bright)",
    };
  }
  return {
    stroke: "var(--color-mv-gold-bright)",
    track: "rgba(212, 165, 116, 0.18)",
    label: "var(--color-mv-gold-bright)",
  };
}

export const MovieAverage = ({
  percentage,
  size = 100,
  strokeWidth = 10,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const { stroke, track, label } = scorePalette(percentage);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="-rotate-90 overflow-visible rounded-full bg-mv-panel/50 ring-1 ring-mv-gold/10"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={track}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div
        className="absolute flex items-center justify-center font-sans text-xs font-bold tabular-nums"
        style={{ width: size, height: size, color: label }}
      >
        {Math.round(percentage)}%
      </div>
    </div>
  );
};
