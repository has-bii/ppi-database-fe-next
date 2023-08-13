import React from "react";

export default function SkeletonPage() {
  return (
    <>
      <div className="w-full h-8 rounded-md bg-slate-300 animate-pulse"></div>
      <div className="w-full h-full rounded-md bg-slate-300 animate-pulse"></div>
    </>
  );
}
