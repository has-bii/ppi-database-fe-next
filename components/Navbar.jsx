import { deleteCookie } from "cookies-next";
import Image from "next/image";
import logo from "@public/Logo.png";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Navbar({ isLogged }) {
  const [navShow, setNavShow] = useState(false);
  const router = useRouter();

  const logoutHandler = () => {
    deleteCookie("user_token");
    router.reload();
  };

  return (
    <nav className="_navbar_container">
      <div className="_brand">
        <Image src={logo} width="50" height="50" alt="PPI Karabuk" priority />
        <p className="_logo">PPI KARABÜK</p>
      </div>

      <ul className={`_navlist ${navShow ? "_show" : ""}`}>
        <li>
          <button onClick={() => setNavShow(false)}>
            <FontAwesomeIcon icon={faXmark} size="xl" />
          </button>
        </li>
        <li>
          <Link href="/" className={router.asPath === "/" ? "_active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/kuliah"
            className={router.asPath === "/kuliah" ? "_active" : ""}
          >
            Kuliah
          </Link>
        </li>
        <li>
          <Link
            href="/articles"
            className={router.asPath === "/articles" ? "_active" : ""}
          >
            Artikel
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className={router.asPath === "/about" ? "_active" : ""}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/faq"
            className={router.asPath === "/faq" ? "_active" : ""}
          >
            FAQ
          </Link>
        </li>
        <li>
          {isLogged ? (
            <button className="_button _list" onClick={logoutHandler}>
              Logout
            </button>
          ) : (
            <button
              className="_button _list"
              onClick={() => router.push("/auth")}
            >
              Login
            </button>
          )}
        </li>
      </ul>

      <button onClick={() => setNavShow(true)}>
        <FontAwesomeIcon icon={faBars} size="2xl" />
      </button>

      {isLogged ? (
        <button className="_button" onClick={logoutHandler}>
          Logout
        </button>
      ) : (
        <button className="_button" onClick={() => router.push("/auth")}>
          Login
        </button>
      )}
    </nav>
  );
}
