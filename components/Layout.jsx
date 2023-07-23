import Navbar from "./Navbar";
import { hasCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Footer from "./Footer";

export default function Layout({ children }) {
  const [cookie, setCookie] = useState();

  useEffect(() => {
    setCookie(hasCookie("user_token"));
  }, []);

  return (
    <>
      <Navbar isLogged={cookie} />
      {children}
      <Footer />
    </>
  );
}
