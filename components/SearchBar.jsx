import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function SearchBar({ className }) {
  return (
    <button
      className={`px-4 py-2 hidden lg:inline-flex bg-slate-200 dark:bg-white/10 hover:dark:bg-white/20 hover:bg-slate-100 transition-all duration-300 ease-in-out rounded-lg text-slate-400 items-center gap-3 w-1/3 ${className}`}
    >
      <FontAwesomeIcon icon={faSearch} />
      <span className="font-light pr-4">Quick search...</span>
    </button>
  );
}
