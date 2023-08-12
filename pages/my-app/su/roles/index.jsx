import Modal from "@components/Modal";
import MyNavbar from "@components/MyNavbar";
import SkeletonTable from "@components/SkeletonTable";
import { useToastContext } from "@components/ToastContext";
import UserDashboard from "@components/UserDashboard";
import { deleteData } from "@lib/deleteData";
import { fetchDataClient } from "@lib/fetchDataClient";
import { fetchUser } from "@lib/fetchUser";
import { getNavbarData } from "@lib/getNavbarData";
import { sendData } from "@lib/sendData";
import { hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Index({ user, navbarData }) {
  const [loading, setLoading] = useState(true);
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();
  const [rolesData, setRolesData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [selected, setSelected] = useState({});
  const nameRef = useRef();
  const editNameRef = useRef();

  useEffect(() => {
    async function fetchData() {
      const res = await fetchDataClient("/role");

      if (res) {
        setRolesData(res);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const newRoleHandler = async () => {
    if (nameRef.current.value.length === 0)
      setToastFailed("Role name is required!");

    setToastLoading("Sending data to server...");
    const res = await sendData("/role/create", { name: nameRef.current.value });

    nameRef.current.value = "";

    if (res) {
      const newArr = [...rolesData.data, res];
      setRolesData({ ...rolesData, data: newArr });
      setToastSuccess("New role has been created");
      return;
    }

    setToastFailed();
  };

  const editRoleHandler = async (id) => {
    if (editNameRef.current.value.length !== 0) {
      setToastLoading("Sending data to server...");

      const res = await sendData("/role/update", {
        id: id,
        name: editNameRef.current.value,
      });

      if (res) {
        const updated = rolesData.data.map((da) => {
          if (res.id === da.id) return res;
          else return da;
        });

        setRolesData({ ...rolesData, data: updated });
        setToastSuccess("Role has been updated");
      } else {
        setToastFailed();
      }

      setSelected({});
      editNameRef.current.value = "";
      setEditModal(false);
    }
  };

  const delRoleHandler = async (id) => {
    setToastLoading("Deleting role...");

    const res = await deleteData("/role/delete", { id: id });

    if (res) {
      setRolesData({
        ...rolesData,
        data: rolesData.data.filter((da) => da.id !== id),
      });
      setToastSuccess("Role has been deleted");
    } else setToastFailed();

    setDelModal(false);
  };

  return (
    <>
      {/* Edit modal */}
      <Modal title="Edit App Status" show={editModal} setShow={setEditModal}>
        <div className="px-5 py-2">
          <label
            htmlFor="name"
            className="block mb-1 capitalize text-slate-400"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-2 py-1 mb-3 border rounded border-slate-300"
            placeholder="Role name..."
            ref={editNameRef}
          />
        </div>
        <div className="modal_buttons">
          <button className="_gray" onClick={() => setEditModal(false)}>
            Cancel
          </button>
          <button
            className="_green"
            onClick={() => editRoleHandler(selected.id)}
          >
            Save
          </button>
        </div>
      </Modal>
      {/* Edit modal end */}

      {/* Delete modal */}
      <Modal title="Delete App Status" show={delModal} setShow={setDelModal}>
        <div className="px-5 py-2">Are you sure to delete the role?</div>
        <div className="modal_buttons">
          <button className="_green" onClick={() => setDelModal(false)}>
            Cancel
          </button>
          <button className="_red" onClick={() => delRoleHandler(selected.id)}>
            Delete
          </button>
        </div>
      </Modal>
      {/* Delete modal end */}

      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen min-h-screen lg:flex-row">
          <MyNavbar role_id={user.role_id} data={navbarData} />
          <div className="flex flex-col w-full gap-4 p-4">
            {/* User info */}
            <UserDashboard pageName="Manage Roles" user={user} />

            {/* Contents */}
            <div className="h-full myapp_content">
              {loading ? (
                <SkeletonTable />
              ) : (
                <div className="_table_container">
                  <table className="table-auto">
                    <thead>
                      <tr>
                        {rolesData?.row.map((r, i) => (
                          <th key={i} scope="col" className="uppercase">
                            {r}
                          </th>
                        ))}
                        <th scope="col" className="uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rolesData?.data.map((da, i) => (
                        <tr key={i}>
                          <td>{da.id}</td>
                          <td>{da.name}</td>
                          <td>
                            <div className="inline-flex items-center gap-2">
                              <button
                                className="btn _red"
                                onClick={() => {
                                  setSelected(da);
                                  setDelModal(true);
                                }}
                              >
                                delete
                              </button>
                              <button
                                className="btn _yellow"
                                onClick={() => {
                                  setSelected(da);
                                  editNameRef.current.value = da.name;
                                  setEditModal(true);
                                }}
                              >
                                edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="2">
                          <input
                            type="text"
                            placeholder="New role name..."
                            className="appearance-none"
                            ref={nameRef}
                          />
                        </td>
                        <td>
                          <button
                            className="btn _green"
                            onClick={newRoleHandler}
                          >
                            Add
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
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

  const navbarData = await getNavbarData({ req, res });

  return { props: { user, navbarData } };
}
