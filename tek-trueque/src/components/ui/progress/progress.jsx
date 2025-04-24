import React from "react";

export function Progress({ value = 0, max = 100, className = "", ...props }) {
  const width = Math.min(100, (value / max) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={`w-full h-2 rounded-full bg-gray-200 overflow-hidden ${className}`}
      {...props}
    >
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
