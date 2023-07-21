import Head from "next/head";
import Navbar from "./Navbar";
import { hasCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const [cookie, setCookie] = useState();

  useEffect(() => {
    setCookie(hasCookie("user_token"));
  }, []);

  return (
    <>
      <Head>
        <title>PPI Karabük</title>
      </Head>
      <Navbar isLogged={cookie} />
      {children}
    </>
  );
}
