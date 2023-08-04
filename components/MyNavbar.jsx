import Image from "next/image";
import logowithtext from "@public/icon/logowithtext.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faRightFromBracket,
  faUserPen,
  faDatabase,
  faUserGroup,
  faFilePen,
  faBars,
  faGraduationCap,
  faFileLines,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";

const iconList = {
  faFilePen: faFilePen,
  faUserGroup: faUserGroup,
  faDatabase: faDatabase,
  faFileLines: faFileLines,
  faGraduationCap: faGraduationCap,
  faList: faList,
  faUserPen: faUserPen,
};

export default function MyNavbar({ role_id, data }) {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const logoutHandler = () => {
    deleteCookie("user_token");
    router.push("/");
  };

  return (
    <nav className="_myapp_nav">
      <div className="flex flex-row items-center justify-between w-full">
        <Image
          src={logowithtext}
          width="auto"
          height="50"
          alt="PPI Karabuk"
          priority
        />
        <button className="block lg:hidden" onClick={() => setShow(!show)}>
          <FontAwesomeIcon className="text-white" icon={faBars} size="2xl" />
        </button>
      </div>

      {/* Dashboard */}
      <div className={`_myapp_navlist_container ${show ? "_show" : ""}`}>
        {/* Dashboard */}
        <ul className="_mynavlist">
          <li>
            <Link
              href="/my-app"
              className={router.asPath === "/my-app" ? "_active" : ""}
            >
              <FontAwesomeIcon icon={faHouse} />
              Dashboard
            </Link>
          </li>
        </ul>

        {data.map(
          (nav, index) =>
            nav.role_id === role_id &&
            nav.active && (
              <div key={index} className="_mynavlist">
                <p className="_head_navlist">{nav.label}</p>
                <ul className="_mynavlist">
                  {nav.link.map((l, index) =>
                    l.active ? (
                      <li key={index}>
                        <Link
                          href={l.url}
                          className={
                            router.pathname.replace("/[id]", "") === l.url
                              ? "_active"
                              : ""
                          }
                        >
                          <FontAwesomeIcon icon={iconList[l.icon]} />
                          {l.name}
                        </Link>
                      </li>
                    ) : (
                      ""
                    )
                  )}
                </ul>
              </div>
            )
        )}

        {/* Logout */}
        <ul className="pt-4 border-t-2 lg:pt-8 lg:mt-auto _mynavlist border-t-white/40">
          <li>
            <Link
              href="/my-app/profile"
              className={router.asPath === "/my-app/profile" ? "_active" : ""}
            >
              <FontAwesomeIcon icon={faUserPen} />
              Profile
            </Link>
          </li>
          <li>
            <button onClick={logoutHandler}>
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
