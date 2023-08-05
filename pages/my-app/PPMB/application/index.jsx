import Modal from "@components/Modal";
import MyNavbar from "@components/MyNavbar";
import { useToastContext } from "@components/ToastContext";
import UserDashboard from "@components/UserDashboard";
import { deleteData } from "@lib/deleteData";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import { getNavbarData } from "@lib/getNavbarData";
import { isPPMB } from "@lib/isRole";
import { sendData } from "@lib/sendData";
import { hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { useState } from "react";

export default function index({ user, navbarData, application }) {
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();
  const [appsData, setAppsData] = useState(application.apps);
  const [delModal, setDelModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState({});
  const [newApp, setNewApp] = useState({
    name: "",
    desc: "",
    active: "1",
    active: "0",
    app_status_id: "1",
  });

  const createNewAppHandler = async () => {
    setToastLoading("Sending data...");
    const res = await sendData("/application/create", newApp);

    setNewApp({
      name: "",
      desc: "",
      active: "1",
      active: "0",
      app_status_id: "1",
    });

    if (res) {
      setToastSuccess("New app has been created");
      setAppsData((prev) => [...prev, res]);
    } else setToastFailed();
  };

  const deleteAppHandler = async (id) => {
    setToastLoading("Deleting app...");
    const res = await deleteData("/application/delete", { id: id });

    if (res) {
      setToastSuccess("App has been deleted");
      setAppsData(appsData.filter((app) => app.id !== id));
    } else setToastFailed();
  };

  return (
    <>
      <Modal title="Delete Application" show={delModal} setShow={setDelModal}>
        <div className="px-5 py-2">Are you sure to delete the application?</div>
        <div className="modal_buttons">
          <button className="_yellow" onClick={() => setDelModal(false)}>
            Cancel
          </button>
          <button
            className="_red"
            onClick={() => {
              deleteAppHandler(selectedApp.id);
              setDelModal(false);
            }}
          >
            Delete
          </button>
        </div>
      </Modal>

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
              <div>
                <div className="_table_container">
                  <table className="table-auto">
                    <thead>
                      <tr>
                        {/* THead */}
                        {application.apps_row.map((row, i) => (
                          <th key={i} scope="col">
                            {row.replace(/(?:_id|_)/g, " ")}
                          </th>
                        ))}
                        <th scope="col">Action</th>
                        {/* THead end */}
                      </tr>
                    </thead>
                    <tbody>
                      {appsData.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center ">
                            No applications created
                          </td>
                        </tr>
                      ) : (
                        appsData.map((app, i) => (
                          <tr key={i}>
                            <td>{app.name}</td>
                            <td>{app.desc}</td>
                            <td>{app.active ? "active" : "deactive"}</td>
                            <td>
                              <span
                                className={app?.app_status?.style + " status"}
                              >
                                {app?.app_status?.name}
                              </span>
                            </td>
                            <td>
                              <div className="inline-flex gap-2 ">
                                <button
                                  className="px-3 py-1.5 rounded _red"
                                  onClick={() => {
                                    setSelectedApp(app);
                                    setDelModal(true);
                                  }}
                                >
                                  Delete
                                </button>
                                <button className="px-3 py-1.5 rounded _blue">
                                  Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                      <tr>
                        <td>
                          <input
                            type="text"
                            placeholder="New application name"
                            className="w-full"
                            value={newApp.name}
                            onChange={(e) =>
                              setNewApp({ ...newApp, name: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="New application description"
                            className="w-full"
                            value={newApp.desc}
                            onChange={(e) =>
                              setNewApp({ ...newApp, desc: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <select
                            value={newApp.active}
                            className="appearance-none "
                            onChange={(e) =>
                              setNewApp({ ...newApp, active: e.target.value })
                            }
                          >
                            <option value="0">deactive</option>
                            <option value="1">active</option>
                          </select>
                        </td>
                        <td>
                          <select
                            value={newApp.app_status_id}
                            className="appearance-none "
                            onChange={(e) =>
                              setNewApp({
                                ...newApp,
                                app_status_id: e.target.value,
                              })
                            }
                          >
                            {application?.app_status.map((status) => (
                              <option key={status.id} value={status.id}>
                                {status.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button
                            className="px-3 py-1.5 rounded _green disabled:_gray"
                            disabled={
                              newApp.name.length === 0 ||
                              newApp.desc.length === 0
                            }
                            onClick={createNewAppHandler}
                          >
                            Create
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
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
  if (!isPPMB(user))
    return {
      redirect: {
        destination: "/my-app",
        permanent: false,
      },
    };

  const navbarData = await getNavbarData({ req, res });

  const application = await fetchData("/application", req, res);

  return { props: { user, navbarData, application } };
}
