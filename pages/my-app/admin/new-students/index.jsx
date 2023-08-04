import { getNavbarData } from "@lib/getNavbarData";
import { isAdmin } from "@lib/isRole";
import { hasCookie, setCookie } from "cookies-next";
import React from "react";

export default function index({ user, navbarData }) {
  return (
    <>
      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-full overflow-hidden lg:h-screen _hide_scrollbar lg:flex-row">
          {/* Navbar */}
          <MyNavbar role_id={user.role_id} data={navbarData} />
          {/* Navbar End */}

          <div className="flex flex-col w-full h-full gap-4 p-4 overflow-auto"></div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res, resolvedUrl }) {
  let cookie = hasCookie("user_token", { req, res });

  if (!cookie) {
    setCookie("callback_url", resolvedUrl, { req, res });
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const user = await fetchUser(req, res);

  if (!user)
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };

  // Check if the role is admin
  if (!isAdmin(user))
    return {
      redirect: {
        destination: "/my-app",
        permanent: false,
      },
    };

  const navbarData = await getNavbarData({ req, res });

  return { props: { user, navbarData } };
}
