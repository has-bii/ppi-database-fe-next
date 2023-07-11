import Image from "next/image";
import logowithtext from "@public/icon/logowithtext.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faRightFromBracket,
  faUserPen,
  faDatabase,
  faSackDollar,
  faUserGroup,
  faFilePen,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";

export default function MyNavbar({ role_id }) {
  const router = useRouter();

  const logoutHandler = () => {
    deleteCookie("user_token");
    router.push("/auth");
  };

  return (
    <nav className="_myapp_nav">
      <Image
        src={logowithtext}
        width="200"
        height="50"
        alt="PPI Karabuk"
        priority
      />

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

      <div>
        <p className="_head_navlist">User</p>
        <ul className="_mynavlist">
          <li>
            <Link
              href="/my-app/bayar-kas"
              className={router.asPath === "/my-app/bayar-kas" ? "_active" : ""}
            >
              <FontAwesomeIcon icon={faSackDollar} />
              Bayar kas
            </Link>
          </li>
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

      {role_id === 2 && (
        <div>
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

      <ul className="pt-8 mt-auto border-t-2 _mynavlist border-t-white/40">
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
    </nav>
  );
}
