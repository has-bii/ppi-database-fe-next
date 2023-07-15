import MyNavbar from "@components/MyNavbar";
import UserDashboard from "@components/UserDashboard";
import axios from "axios";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import Head from "next/head";
import { useEffect } from "react";

export default function index({ user }) {
  return (
    <div className="bg-base-grey">
      <Head>
        <title>My App | PPI Karabük</title>
      </Head>
      <div className="flex flex-col w-screen h-screen overflow-auto lg:flex-row _hide_scrollbar">
        {/* Navbar */}
        <MyNavbar role_id={user.role_id} />
        {/* Navbar End */}

        <div className="flex flex-col w-full gap-4 p-4">
          {/* User Info */}
          <UserDashboard pageName="Isi Database" user={user} />
          {/* User Info End */}

          {/* Contents */}
          <div className="w-full h-full gap-4 overflow-auto _card_myapp _hide_scrollbar"></div>
          {/* Contents end */}
        </div>
      </div>
    </div>
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
