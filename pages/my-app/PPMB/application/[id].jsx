import Modal from "@components/Modal";
import MyNavbar from "@components/MyNavbar";
import { useToastContext } from "@components/ToastContext";
import UserDashboard from "@components/UserDashboard";
import { deleteData } from "@lib/deleteData";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import { formatDate } from "@lib/formatDate";
import { getNavbarData } from "@lib/getNavbarData";
import { isPPMB } from "@lib/isRole";
import { sendData } from "@lib/sendData";
import { hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { useState } from "react";

export default function index({ user, navbarData, userApps }) {
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();

  const openLink = (link) => {
    window.open(process.env.NEXT_PUBLIC_API_URL + "/" + link, "_blank");
  };

  return (
    <>
      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-full lg:flex-row">
          <MyNavbar role_id={user.role_id} data={navbarData} />
          <div className="flex flex-col w-full gap-4 p-4">
            {/* User info */}
            <UserDashboard pageName="Pendaftaran" user={user} />

            {/* Contents */}
            <div className="h-full myapp_content">
              <h2 className="text-lg font-semibold text-black">
                {userApps?.application?.name}
              </h2>
              <div className="_table_container">
                <table className="table-auto">
                  <thead>
                    <tr>
                      {/* THead */}
                      {userApps?.user_apps_row?.map(
                        (row, i) =>
                          row !== "application_id" && (
                            <th key={i} scope="col">
                              {row.replace(/(?:_id|_)/g, " ")}
                            </th>
                          )
                      )}
                      <th scope="col">Action</th>
                      {/* THead end */}
                    </tr>
                  </thead>
                  <tbody>
                    {userApps?.user_apps?.total === 0 ? (
                      <tr>
                        <td
                          colSpan={userApps?.user_apps_row.length}
                          className="text-center"
                        >
                          There are no applications
                        </td>
                      </tr>
                    ) : (
                      userApps?.user_apps?.data?.map((user_app, i) => (
                        <tr key={i}>
                          <td>{user_app?.user?.name}</td>
                          <td>
                            <span
                              className={
                                "status " + user_app?.app_status?.style
                              }
                            >
                              {user_app?.app_status?.name}
                            </span>
                          </td>
                          <td>{user_app?.education?.name}</td>
                          <td>{user_app?.nilai_ujian}</td>
                          <td className="whitespace-normal">
                            {user_app?.jurusan_1}
                          </td>
                          <td className="whitespace-normal">
                            {user_app?.jurusan_2}
                          </td>
                          <td className="whitespace-normal">
                            {user_app?.jurusan_3}
                          </td>
                          <td>
                            <button
                              className="px-2 py-1 text-sm text-white bg-black rounded-md"
                              onClick={() => openLink(user_app?.receipt)}
                            >
                              view
                            </button>
                          </td>
                          <td>{formatDate(user_app.updated_at)}</td>
                          <td>
                            <button className="px-2 py-1 text-sm rounded-md _green">
                              View Bio
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res, resolvedUrl, params }) {
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
  if (!isPPMB(user))
    return {
      redirect: {
        destination: "/my-app",
        permanent: false,
      },
    };

  const navbarData = await getNavbarData({ req, res });

  const userApps = await fetchData("/user-app", req, res, {
    application_id: params.id,
  });

  if (!userApps)
    return {
      redirect: {
        destination: "/my-app/PPMB/application",
        permanent: false,
      },
    };

  if (!userApps.application)
    return {
      redirect: {
        destination: "/my-app/PPMB/application",
        permanent: false,
      },
    };

  return { props: { user, navbarData, userApps } };
}
