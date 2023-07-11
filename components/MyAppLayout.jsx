import Head from "next/head";
import React, { useEffect, useState } from "react";
import MyNavbar from "./MyNavbar";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function MyAppLayout({ children }) {
  let cookie = hasCookie("user_token");
  const router = useRouter();
  const [user, setUser] = useState();
  const [role, setRole] = useState();

  useEffect(() => {
    if (!cookie) {
      router.push("/auth");
      return;
    }

    const fetchUser = async (cookie) => {
      const res = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          return res.data.result;
        })
        .catch((err) => {
          console.error(err);

          deleteCookie("user_token");
          router.push("/auth");
        });

      setUser(res);
      setRole(res.role_id);
    };

    cookie = getCookie("user_token");

    fetchUser(cookie);
  }, []);

  return (
    <>
      <Head>
        <title>My App | PPI Karabük</title>
      </Head>
      <div className="flex flex-col w-screen h-screen overflow-hidden lg:flex-row">
        <MyNavbar role_id={role} />
        {children}
      </div>
    </>
  );
}
