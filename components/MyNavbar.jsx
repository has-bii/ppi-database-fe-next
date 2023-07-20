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
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";

export default function MyNavbar({ role_id }) {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const logoutHandler = () => {
    deleteCookie("user_token");
    router.push("/auth");
  };

  return (
    <nav className="_myapp_nav">
      <div className="flex flex-row items-center justify-between w-full">
        <Image
          src={logowithtext}
          width="200"
          height="50"
          alt="PPI Karabuk"
          priority
        />
        <button className="block lg:hidden" onClick={() => setShow(!show)}>
          <FontAwesomeIcon className="text-white" icon={faBars} size="2xl" />
        </button>
      </div>

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

        {/* User */}
        {role_id !== 1 && (
          <div className="_mynavlist">
            <p className="_head_navlist">User</p>
            <ul className="_mynavlist">
              <li>
                <Link
                  href="/my-app/isi-database"
                  className={
                    router.asPath === "/my-app/isi-database" ? "_active" : ""
                  }
                >
                  <FontAwesomeIcon icon={faFilePen} />
                  Database
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Admin */}
        {role_id === 1 && (
          <div className="_mynavlist">
            <p className="_head_navlist">Admin</p>
            <ul className="_mynavlist">
              <li>
                <Link
                  href="/my-app/users"
                  className={router.asPath === "/my-app/users" ? "_active" : ""}
                >
                  <FontAwesomeIcon icon={faUserGroup} />
                  Users
                </Link>
              </li>
              <li>
                <Link
                  href="/my-app/database"
                  className={
                    router.asPath === "/my-app/database" ? "_active" : ""
                  }
                >
                  <FontAwesomeIcon icon={faDatabase} />
                  Database
                </Link>
              </li>
            </ul>
          </div>
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
