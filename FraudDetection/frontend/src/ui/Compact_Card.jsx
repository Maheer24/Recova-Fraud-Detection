import React from "react";

export const CompactCard = ({ children, className }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-3 ${className}`}
    >
      {children}
    </div>
  );
};

export const CompactCardContent = ({ children, className }) => {
  return <div className={`p-1 ${className}`}>{children}</div>;
};