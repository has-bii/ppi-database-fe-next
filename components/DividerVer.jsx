import React from "react";

export default function DividerVer({ style }) {
  return (
    <span
      className={`w-[1px] h-full bg-black/25 dark:bg-white/25 ${style}`}
    ></span>
  );
}
