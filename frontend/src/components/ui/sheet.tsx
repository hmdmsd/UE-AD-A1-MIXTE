import React, { useState, useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface SheetProps {
  children: ReactNode;
  side?: "left" | "right";
  className?: string;
  overlayClassName?: string;
}

export const Sheet: React.FC<SheetProps> = ({
  children,
  side = "right",
  className = "",
  overlayClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${overlayClassName}`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 ${side}-0 w-full sm:w-80 bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0"
            : side === "left"
            ? "-translate-x-full"
            : "translate-x-full"
        } ${className}`}
      >
        {children}
      </div>
    </>
  );
};

interface SheetTriggerProps {
  children: ReactNode;
}

export const SheetTrigger: React.FC<SheetTriggerProps> = ({ children }) => {
  return children;
};

interface SheetContentProps {
  children: ReactNode;
  className?: string;
}

export const SheetContent: React.FC<SheetContentProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => document.dispatchEvent(new CustomEvent("closeSheet"))}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto px-4">{children}</div>
    </div>
  );
};

export const SheetHeader: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="mb-4 text-lg font-semibold text-white">{children}</div>
  );
};

export const SheetFooter: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <div className="mt-auto p-4 border-t border-gray-700">{children}</div>;
};
