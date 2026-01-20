import React from "react";

const LoadingDots = () => {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.32s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.16s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-white" />
    </div>
  );
};

export default LoadingDots;
