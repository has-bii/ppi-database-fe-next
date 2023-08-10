import MyNavbar from "@components/MyNavbar";
import { useToastContext } from "@components/ToastContext";
import UserDashboard from "@components/UserDashboard";
import { deleteData } from "@lib/deleteData";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import { getNavbarData } from "@lib/getNavbarData";
import { isSU } from "@lib/isRole";
import { sendData } from "@lib/sendData";
import { hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function Index({ user, data, navbarData }) {
  const router = useRouter();
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();
  const [loading, setLoading] = useState(false);
  const [timerID, setTimerID] = useState();
  const [menuData, setMenuData] = useState([]);
  const [newMenu, setNewMenu] = useState({
    label: "",
    role_id: "2",
    active: "1",
  });

  const createMenuHandler = async () => {
    setLoading(true);
    setToastLoading("Sending data...");

    const res = await sendData("/my-menu/create", newMenu);
    setNewMenu({ label: "", role_id: "2", active: "1" });
    setLoading(false);

    if (res) {
      setToastSuccess("New menu has been created");
      setMenuData((prev) => [...prev, res]);
      return;
    }

    setToastFailed();
  };

  const deleteMenuHandler = async (id) => {
    setLoading(true);
    setToastLoading("Deleting data...");

    const res = await deleteData("/my-menu/delete", { id: id });
    setLoading(false);

    if (res) {
      setMenuData(menuData.filter((menu) => menu.id !== id));
      setToastSuccess("Menu has been deleted");
      return;
    }

    setToastFailed();
  };

  const changeDataHandler = (index, value, property) => {
    const updatedData = menuData.map((menu, i) => {
      if (index === i) {
        menu[property] = value;

        return menu;
      } else return menu;
    });

    setMenuData(updatedData);
  };

  const autoSaveHandler = async (data) => {
    clearTimeout(timerID);

    setTimerID(
      setTimeout(async () => {
        const res = await sendData("/my-menu/update", data);

        if (res) {
          setToastSuccess("Saved...");
          return;
        }

        setToastFailed();
      }, 1000)
    );
  };

  useEffect(() => {
    setMenuData(data.menu);
  }, [data]);

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
            <UserDashboard pageName="Manage Menu" user={user} />

            {/* Contents */}
            <div className="myapp_content">
              <div>
                <h2 className="mb-2 text-xl font-semibold">Menus</h2>
                <div className="_table_container">
                  <table className="table-auto">
                    <thead>
                      <tr>
                        {/* THead */}
                        {data.columns.map((column, i) => (
                          <th key={i} scope="col">
                            {column.replace("_id", " ")}
                          </th>
                        ))}
                        <th scope="col">Action</th>
                        {/* THead end */}
                      </tr>
                    </thead>
                    <tbody>
                      {menuData.map((menu, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              value={menu.label}
                              onChange={(e) => {
                                changeDataHandler(
                                  index,
                                  e.target.value,
                                  "label"
                                );
                                autoSaveHandler(menu);
                              }}
                            />
                          </td>
                          <td>
                            <select
                              className="appearance-none"
                              value={menu.role_id}
                              onChange={(e) => {
                                changeDataHandler(
                                  index,
                                  e.target.value,
                                  "role_id"
                                );
                                autoSaveHandler(menu);
                              }}
                            >
                              {data.roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <select
                              className="appearance-none"
                              value={menu.active}
                              onChange={(e) => {
                                changeDataHandler(
                                  index,
                                  e.target.value,
                                  "active"
                                );
                                autoSaveHandler(menu);
                              }}
                            >
                              <option value="0">false</option>
                              <option value="1">active</option>
                            </select>
                          </td>
                          <td>
                            <div className="inline-flex gap-2">
                              <button
                                className="_red px-3 py-1.5 rounded"
                                disabled={loading}
                                onClick={() => deleteMenuHandler(menu.id)}
                              >
                                Delete
                              </button>
                              <button
                                className="_blue px-3 py-1.5 rounded"
                                disabled={loading}
                                onClick={() =>
                                  router.push(`/my-app/su/menu/${menu.id}`)
                                }
                              >
                                Open
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <input
                            type="text"
                            placeholder="New menu name..."
                            className="w-full disabled:bg-white"
                            value={newMenu.label}
                            onChange={(e) =>
                              setNewMenu({ ...newMenu, label: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <select
                            className="appearance-none"
                            value={newMenu.role_id}
                            onChange={(e) =>
                              setNewMenu({
                                ...newMenu,
                                role_id: e.target.value,
                              })
                            }
                          >
                            {data.roles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            className="appearance-none"
                            value={newMenu.active}
                            onChange={(e) =>
                              setNewMenu({
                                ...newMenu,
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
                            onClick={createMenuHandler}
                            disabled={loading}
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
  if (!isSU(user))
    return {
      redirect: {
        destination: "/my-app",
        permanent: false,
      },
    };

  const data = await fetchData("/my-menu", req, res);

  const navbarData = await getNavbarData({ req, res });

  return { props: { user, data, navbarData } };
}
