import React from "react";

interface CameraReticleProps {
  className?: string;
  size?: number;
}

export const CameraReticle: React.FC<CameraReticleProps> = ({
  className = "w-4 h-4 text-accent-crimson/80",
  size = 16,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top-Left Corner Tick */}
      <path
        d="M 4 8 V 4 H 8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top-Right Corner Tick */}
      <path
        d="M 16 4 H 20 V 8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom-Left Corner Tick */}
      <path
        d="M 4 16 V 20 H 8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom-Right Corner Tick */}
      <path
        d="M 16 20 H 20 V 16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center Target Dot */}
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
};
