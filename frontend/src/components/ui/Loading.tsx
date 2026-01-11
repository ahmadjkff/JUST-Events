import React from "react";

type Props = {
  message?: string;
  center?: boolean;
  size?: number; // px
};

function Loading({ message, center = true, size = 48 }: Props) {
  const containerClass = center
    ? "flex items-center justify-center h-screen"
    : "flex items-center justify-center py-6";

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <svg
          className="animate-spin"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" stroke="#E5E7EB" strokeWidth="4" />
          <path
            d="M22 12a10 10 0 00-10-10"
            stroke="#2563EB"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <span className="text-muted-foreground text-sm">
          {message ?? "Loading..."}
        </span>
      </div>
    </div>
  );
}

export default Loading;
