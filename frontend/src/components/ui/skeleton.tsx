import React from "react";

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-md ${className}`}
      style={{ minHeight: "1rem" }}
    />
  );
};

export default Skeleton;
