import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CaretUser(props) {
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    function handleOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setDropdown(false);
    }

    if (dropdown) {
      window.addEventListener("click", handleOutside);

      return () => {
        window.removeEventListener("click", handleOutside);
      };
    }
  }, [dropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="text-slate-400 dark:text-white/75 hover:text-slate-500 dark:hover:text-white"
        onClick={() => setDropdown(!dropdown)}
      >
        <FontAwesomeIcon icon={faCaretDown} size="lg" />
      </button>
      <div
        className={` bg-white dark:bg-dark-secondary dark:border-white/10 rounded-xl absolute top-8 z-10 right-0 border animate-fade drop-shadow-md ${
          dropdown ? "block" : "hidden"
        }`}
      >
        <ul className="text-slate-400 dark:text-white/75 divide-y dark:divide-white/10">
          <li className=" hover:text-slate-500 dark:hover:text-white px-4 py-1.5">
            <Link href="/my-app/profile">Profile</Link>
          </li>
          <li className=" hover:text-slate-500 dark:hover:text-white px-4 py-1.5">
            <Link href="/my-app/settings">Settings</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
