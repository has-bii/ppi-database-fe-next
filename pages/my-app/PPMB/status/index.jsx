import Modal from "@components/Modal";
import MyNavbar from "@components/MyNavbar";
import { useToastContext } from "@components/ToastContext";
import UserDashboard from "@components/UserDashboard";
import { deleteData } from "@lib/deleteData";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import { getNavbarData } from "@lib/getNavbarData";
import { sendData } from "@lib/sendData";
import { hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { useState } from "react";

export default function index({ user, navbarData, statusData }) {
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState(statusData.statuses);
  const [delModal, setDelModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [newStatus, setNewStatus] = useState({ name: "", style: "green" });
  const [selected, setSelected] = useState({});

  const newStatusHandler = async () => {
    setLoading(true);
    setToastLoading("Sending data...");

    const res = await sendData("/app-status/create", newStatus);

    setNewStatus({ name: "", style: "green" });
    setLoading(false);

    if (res) {
      setStatuses((prev) => [...prev, res]);
      setToastSuccess("New status has been created");
      return;
    }

    setToastFailed();
  };

  const deleteStatusHandler = async (id) => {
    setToastLoading("Deleting app status...");
    setLoading(true);
    const res = await deleteData("/app-status/delete", { id: id });

    if (res) {
      setToastSuccess("App status has been deleted");
      setStatuses(statuses.filter((status) => status.id !== id));
    } else setToastFailed();

    setLoading(false);
  };

  const editStatHandler = async () => {
    setToastLoading("Sending data...");
    const res = await sendData("/app-status/update", selected);

    setSelected({});

    if (res) {
      setToastSuccess("The app status has been updated");
      setStatuses(
        statuses.map((status) => {
          if (status.id === res.id) return res;
          else return status;
        })
      );
    } else setToastFailed();
  };

  return (
    <>
      {/* Delete modal */}
      <Modal title="Delete App Status" show={delModal} setShow={setDelModal}>
        <div className="px-5 py-2">Are you sure to delete the app status?</div>
        <div className="modal_buttons">
          <button className="_green" onClick={() => setDelModal(false)}>
            Cancel
          </button>
          <button
            className="_red"
            onClick={() => {
              deleteStatusHandler(selected.id);
              setDelModal(false);
            }}
          >
            Delete
          </button>
        </div>
      </Modal>
      {/* Delete modal end */}

      {/* Edit modal */}
      {Object.keys(selected).length !== 0 && (
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
              placeholder="Application name..."
              value={selected.name}
              onChange={(e) =>
                setSelected({ ...selected, name: e.target.value })
              }
            />
            <label
              htmlFor="style"
              className="block mb-1 capitalize text-slate-400"
            >
              style
            </label>
            <select
              type="text"
              id="style"
              className="w-full px-2 py-1 mb-3 border rounded border-slate-300"
              value={selected.style}
              onChange={(e) =>
                setSelected({ ...selected, style: e.target.value })
              }
            >
              <option value="green">green</option>
              <option value="yellow">yellow</option>
              <option value="red">red</option>
              <option value="rose">rose</option>
              <option value="sky">sky</option>
              <option value="blue">blue</option>
              <option value="gray">gray</option>
              <option value="slate">slate</option>
            </select>
          </div>
          <div className="modal_buttons">
            <button className="_gray" onClick={() => setEditModal(false)}>
              Cancel
            </button>
            <button
              className="_green"
              onClick={() => {
                setEditModal(false);
                editStatHandler();
              }}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
      {/* Edit modal end */}

      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-screen lg:h-full lg:flex-row">
          <MyNavbar role_id={user.role_id} data={navbarData} />
          <div className="flex flex-col w-full gap-4 p-4">
            {/* User info */}
            <UserDashboard pageName="Status" user={user} />

            {/* Contents */}
            <div className="h-full myapp_content">
              <div className="_table_container">
                <table className="table-auto">
                  <thead>
                    <tr>
                      {statusData?.status_row?.map((row, i) => (
                        <th key={i} scope="col">
                          {row}
                        </th>
                      ))}
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statuses?.map((status) => (
                      <tr key={status.id}>
                        <td className="capitalize ">{status.name}</td>
                        <td>
                          <span className={"status " + status.style}>
                            {status.style}
                          </span>
                        </td>
                        <td>
                          <div className="inline-flex items-center gap-2">
                            <button
                              className="btn _rose"
                              onClick={() => {
                                setSelected(status);
                                setDelModal(true);
                              }}
                            >
                              Delete
                            </button>
                            <button
                              className="btn _yellow"
                              onClick={() => {
                                setSelected(status);
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
                      <td>
                        <input
                          type="text"
                          className="w-full appearance-none"
                          placeholder="Status name..."
                          value={newStatus.name}
                          onChange={(e) =>
                            setNewStatus({ ...newStatus, name: e.target.value })
                          }
                        />
                      </td>
                      <td>
                        <select
                          className={`appearance-none status text-center ${newStatus.style}`}
                          value={newStatus.style}
                          onChange={(e) =>
                            setNewStatus({
                              ...newStatus,
                              style: e.target.value,
                            })
                          }
                        >
                          <option value="green">green</option>
                          <option value="yellow">yellow</option>
                          <option value="red">red</option>
                          <option value="rose">rose</option>
                          <option value="sky">sky</option>
                          <option value="blue">blue</option>
                          <option value="gray">gray</option>
                          <option value="slate">slate</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn _green"
                          disabled={loading || newStatus.name.length < 5}
                          onClick={newStatusHandler}
                        >
                          Add
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

  const statusData = await fetchData("/app-status", req, res);

  return { props: { user, navbarData, statusData } };
}
