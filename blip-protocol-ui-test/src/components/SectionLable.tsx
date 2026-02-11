import React from "react";

interface SectionLabelProps {
  text: string;
  className?: string;
}
export const SectionLabel: React.FC<SectionLabelProps> = ({
  text,
  className = "",
}) => (
  <div className={`flex gap-3 mb-8 ${className}`}>
    <div className="flex gap-1">
      <div className="w-1 h-1 rounded-full bg-[#00FF94]" />
      <div className="w-1 h-1 rounded-full bg-[#00FF94] opacity-50" />
      <div className="w-1 h-1 rounded-full bg-[#00FF94] opacity-25" />
    </div>
    <span className="text-[#00FF94] uppercase tracking-[0.3em] text-[10px] font-mono font-bold">
      {text}
    </span>
  </div>
);
