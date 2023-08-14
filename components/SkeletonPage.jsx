import React from "react";

export default function SkeletonPage() {
  return (
    <div className="flex flex-col h-full gap-2">
      <div className="w-full h-8 rounded-md bg-slate-300 animate-pulse"></div>
      <div className="w-full h-full min-h-[8rem] rounded-md bg-slate-300 animate-pulse"></div>
    </div>
  );
}
