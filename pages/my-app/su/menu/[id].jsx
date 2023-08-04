import MyNavbar from "@components/MyNavbar";
import SkeletonTable from "@components/SkeletonTable";
import { useToastContext } from "@components/ToastContext";
import UserDashboard from "@components/UserDashboard";
import { deleteData } from "@lib/deleteData";
import { fetchData } from "@lib/fetchData";
import { fetchDataClient } from "@lib/fetchDataClient";
import { fetchUser } from "@lib/fetchUser";
import { isSU } from "@lib/isRole";
import { sendData } from "@lib/sendData";
import { hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

export default function index({ user }) {
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [timerID, setTimerID] = useState("");
  const [menu, setMenu] = useState({});
  const [linkCol, setLinkCol] = useState([]);
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({
    name: "",
    active: 0,
    url: "",
    icon: "",
  });

  const createLinkHandler = async () => {
    setLoading(true);
    setToastLoading("Sending data...");

    const res = await sendData("/link/create", {
      ...newLink,
      my_menu_id: menu.id,
    });

    setLoading(false);

    setNewLink({
      name: "",
      active: 0,
      url: "",
      icon: "",
    });

    if (res) {
      setToastSuccess("New link has been created");
      setLinks((prev) => [...prev, res]);
      return;
    }

    setToastFailed();
  };

  const deleteLinkHandler = async (id) => {
    setLoading(true);
    setToastLoading("Deleting data...");

    const res = await deleteData("/link/delete", { id: id });
    setLoading(false);

    if (res) {
      setLinks(links.filter((link) => link.id !== id));
      setToastSuccess("Link has been deleted");
      return;
    }

    setToastFailed();
  };

  const changeDataHandler = (index, value, property) => {
    const updatedData = links.map((menu, i) => {
      if (index === i) {
        menu[property] = value;

        return menu;
      } else return menu;
    });

    setLinks(updatedData);
  };

  const autoSaveHandler = async (data) => {
    clearTimeout(timerID);

    setTimerID(
      setTimeout(async () => {
        const res = await sendData("/link/update", {
          ...data,
          my_menu_id: menu.id,
        });

        if (res) {
          setToastSuccess("Saved...");
          return;
        }

        setToastFailed();
      }, 1000)
    );
  };

  const fetchMenuLink = async () => {
    setLoading(true);
    const res = await fetchDataClient("/my-menu", { id: router.query.id });
    setLoading(false);

    if (res) {
      setLinkCol(res.link_columns);
      setMenu(res.menus);
      setLinks(res.menus.link);
    } else setToastFailed("Failed to load data...");
  };

  useEffect(() => {
    fetchMenuLink();
  }, []);

  return (
    <>
      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-screen overflow-auto _hide_scrollbar lg:flex-row">
          <MyNavbar role_id={user.role_id} />
          <div className="flex flex-col w-full gap-4 p-4">
            {/* User info */}
            <UserDashboard pageName="Manage Menu" user={user} />

            {/* Contents */}
            <div className="_myapp_content">
              <div>
                {loading ? (
                  <SkeletonTable />
                ) : (
                  <>
                    <div className="flex flex-col gap-2 p-4 mb-4 border border-black rounded-lg">
                      <label>
                        Label:
                        <input
                          type="text"
                          className="ml-2"
                          value={menu.label}
                          onChange={(e) =>
                            setMenu({ ...menu, label: e.target.value })
                          }
                        />
                      </label>
                      <label>
                        Active:
                        <select
                          className="ml-2 appearance-none"
                          value={menu.active}
                          onChange={(e) =>
                            setMenu({ ...menu, active: e.target.value })
                          }
                        >
                          <option value="0">False</option>
                          <option value="1">True</option>
                        </select>
                      </label>
                      <label>
                        Role:
                        <select
                          className="ml-2 appearance-none"
                          value={menu.role_id}
                          onChange={(e) =>
                            setMenu({ ...menu, role_id: e.target.value })
                          }
                        >
                          <option value="1">Admin</option>
                          <option value="2">Student</option>
                          <option value="3">User</option>
                          <option value="4">Super User</option>
                        </select>
                      </label>
                    </div>
                    <div className="_table_container">
                      <table className="table-auto">
                        <thead>
                          <tr>
                            {/* THead */}
                            {linkCol.map(
                              (col, i) =>
                                col !== "my_menu_id" && (
                                  <th key={i} scope="col">
                                    {col}
                                  </th>
                                )
                            )}
                            <th scope="col">Action</th>
                            {/* THead end */}
                          </tr>
                        </thead>
                        <tbody>
                          {links.map((link, i) => (
                            <tr key={i}>
                              <td>
                                <input
                                  type="text"
                                  placeholder="Link name..."
                                  className="w-full disabled:bg-white"
                                  value={link.name}
                                  onChange={(e) => {
                                    changeDataHandler(
                                      i,
                                      e.target.value,
                                      "name"
                                    );
                                    autoSaveHandler(link);
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  placeholder="Link url..."
                                  className="w-full disabled:bg-white"
                                  value={link.url}
                                  onChange={(e) => {
                                    changeDataHandler(i, e.target.value, "url");
                                    autoSaveHandler(link);
                                  }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  placeholder="Link icon..."
                                  className="w-full disabled:bg-white"
                                  value={link.icon}
                                  onChange={(e) => {
                                    changeDataHandler(
                                      i,
                                      e.target.value,
                                      "icon"
                                    );
                                    autoSaveHandler(link);
                                  }}
                                />
                              </td>
                              <td>
                                <select
                                  className="appearance-none"
                                  value={link.active}
                                  onChange={(e) => {
                                    changeDataHandler(
                                      i,
                                      e.target.value,
                                      "active"
                                    );
                                    autoSaveHandler(link);
                                  }}
                                >
                                  <option value="0">false</option>
                                  <option value="1">true</option>
                                </select>
                              </td>
                              <td>
                                <button
                                  className="_red px-3 py-1.5 rounded"
                                  disabled={loading}
                                  onClick={() => deleteLinkHandler(link.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td>
                              <input
                                type="text"
                                placeholder="New menu name..."
                                className="w-full disabled:bg-white"
                                value={newLink.name}
                                onChange={(e) =>
                                  setNewLink({
                                    ...newLink,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                placeholder="New menu url..."
                                className="w-full disabled:bg-white"
                                value={newLink.url}
                                onChange={(e) =>
                                  setNewLink({
                                    ...newLink,
                                    url: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                placeholder="New menu icon..."
                                className="w-full disabled:bg-white"
                                value={newLink.icon}
                                onChange={(e) =>
                                  setNewLink({
                                    ...newLink,
                                    icon: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <select
                                className="appearance-none"
                                value={newLink.active}
                                onChange={(e) =>
                                  setNewLink({
                                    ...newLink,
                                    active: e.target.value,
                                  })
                                }
                              >
                                <option value="0">false</option>
                                <option value="1">true</option>
                              </select>
                            </td>
                            <td>
                              <button
                                className="_green px-3 py-1.5 rounded"
                                disabled={
                                  loading ||
                                  newLink.name.length < 3 ||
                                  newLink.url.length < 3 ||
                                  newLink.icon.length < 3
                                }
                                onClick={createLinkHandler}
                              >
                                Add
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
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
  if (!isSU(user))
    return {
      redirect: {
        destination: "/my-app",
        permanent: false,
      },
    };

  return { props: { user } };
}
