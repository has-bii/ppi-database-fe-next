import MyNavbar from "@components/MyNavbar";
import axios from "axios";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import Head from "next/head";
import { useEffect } from "react";

export default function index({ user }) {
  return (
    <>
      <Head>
        <title>My App | PPI Karabük</title>
      </Head>
      <div className="flex flex-col w-screen h-screen overflow-hidden lg:flex-row">
        <MyNavbar role_id={user.role_id} />
        <div className="flex w-full">Isi Database</div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  let cookie = hasCookie("user_token", { req, res });

  if (!cookie) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  cookie = getCookie("user_token", { req, res });

  const user = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    })
    .then((res) => {
      return res.data.result;
    })
    .catch((err) => {
      deleteCookie("user_token", { req, res });
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    });

  return { props: { user } };
}
