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
  faFileCirclePlus,
  faTag,
  faUserSecret,
  faUserLock,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { deleteCookie } from "cookies-next";
import { useNavData } from "./MyNavContext";
import { useSession } from "./UserProvider";
import Theme from "./Theme";

const iconList = {
  faFilePen: faFilePen,
  faUserGroup: faUserGroup,
  faDatabase: faDatabase,
  faFileLines: faFileLines,
  faGraduationCap: faGraduationCap,
  faList: faList,
  faUserPen: faUserPen,
  faFileCirclePlus: faFileCirclePlus,
  faTag: faTag,
  faUserSecret: faUserSecret,
  faUserLock: faUserLock,
};

export default function MyAppNav() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const { menuData } = useNavData();
  const { user } = useSession();

  const logoutHandler = () => {
    deleteCookie("user_token");
    router.push("/");
  };

  return (
    <nav className="myapp_nav">
      <div className="inline-flex items-center justify-between w-full">
        <Link href="/my-app">
          <Image
            src={logowithtext}
            width="auto"
            height="50"
            alt="PPI Karabuk"
            priority
          />
        </Link>
        <button className="block lg:hidden" onClick={() => setShow(!show)}>
          <FontAwesomeIcon className="text-white" icon={faBars} size="2xl" />
        </button>
      </div>

      {/* Dashboard */}
      <div className={`myapp_navlist_container ${show ? "show" : ""}`}>
        {/* Button */}
        <div className="inline-flex items-center justify-between w-full lg:hidden">
          <Link href="/my-app">
            <Image
              src={logowithtext}
              width="auto"
              height="50"
              alt="PPI Karabuk"
              priority
            />
          </Link>
          <button className="block lg:hidden" onClick={() => setShow(!show)}>
            <FontAwesomeIcon className="text-white" icon={faBars} size="2xl" />
          </button>
        </div>
        {/* Button End */}

        {/* Dashboard */}
        <ul className="mynavlist">
          <li>
            <Link
              href="/my-app"
              className={router.asPath === "/my-app" ? "active" : ""}
            >
              <FontAwesomeIcon icon={faHouse} />
              Dashboard
            </Link>
          </li>
        </ul>

        {menuData.map(
          (nav, index) =>
            nav.role_id === user?.role_id &&
            nav.active && (
              <div key={index} className="flex flex-col gap-2">
                <p className="head_navlist">{nav.label}</p>
                <ul className="mynavlist">
                  {nav.link.map((l, index) =>
                    l.active ? (
                      <li key={index}>
                        <Link
                          href={l.url}
                          className={
                            router.pathname.replace("/[id]", "") === l.url
                              ? "active"
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
        <ul className="pt-4 mt-auto border-y lg:py-4 mynavlist border-y-white/10">
          <li>
            <Link
              href="/my-app/profile"
              className={router.asPath === "/my-app/profile" ? "active" : ""}
            >
              <FontAwesomeIcon icon={faUserPen} />
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/my-app/settings"
              className={router.asPath === "/my-app/settings" ? "active" : ""}
            >
              <FontAwesomeIcon icon={faGear} />
              Settings
            </Link>
          </li>
          <li>
            <button onClick={logoutHandler}>
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </button>
          </li>
        </ul>

        <div>
          <Theme />
        </div>
      </div>
    </nav>
  );
}
