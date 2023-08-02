import Modal from "@components/Modal";
import MyNavbar from "@components/MyNavbar";
import SkeletonTable from "@components/SkeletonTable";
import UserDashboard from "@components/UserDashboard";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteData } from "@lib/deleteData";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import { formatDate } from "@lib/formatDate";
import { isAdmin } from "@lib/isRole";
import { sendData } from "@lib/sendData";
import { useToastContext } from "@pages/ToastContext";
import axios from "axios";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import React, { useRef, useState } from "react";

export default function index({ user, data }) {
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();
  const [dataForm, setDataForm] = useState(data?.cols?.data);
  const [delModal, setDelModal] = useState(false);
  const [changeRoleModal, setChangeRoleModal] = useState(false);
  const [changeStatusModal, setChangeStatusModal] = useState(false);
  const roleRef = useRef();
  const statRef = useRef();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState({
    limit: 10,
  });
  const [newForm, setNewForm] = useState({
    name: "",
    desc: "",
    status_id: "",
    role_id: "",
  });

  const checkHandler = (e, id) => {
    if (e.target.checked) setSelected((old) => [...old, id]);
    else setSelected(selected.filter((prev) => prev !== id));
  };

  const checkAllHandler = (e) => {
    if (e.target.checked) setSelected(dataForm.map((d) => d.id));
    else setSelected([]);
  };

  const enterHandler = async (e) => {
    if (e.key === "Enter" && newForm.name.length >= 6) {
      e.target.blur();
      newFormHandler();
    }
  };

  const newFormHandler = async () => {
    setNewForm({ name: "", desc: "", status_id: "", role_id: "" });
    setSending(true);
    setToastLoading("Sending data...");
    const response = await sendData("/form/create", newForm);

    if (!response) {
      setToastFailed("Failed to send data...");
      setSending(false);
      return;
    }

    setToastSuccess("New form has been created");
    setSending(false);
    setDataForm((prev) => [...prev, response]);
  };

  const delFormsHandler = async () => {
    setDelModal(false);
    setToastLoading("Deleting the forms...");

    const response = await deleteData("/form/delete", {
      id: selected.toString(),
    });

    if (!response) {
      setToastFailed("Failed to delete the forms!");
      return;
    }

    setToastSuccess(response);
    setDataForm(dataForm.filter((d) => !selected.includes(d.id)));
    setSelected([]);
  };

  const changeRoleFormsHandler = async () => {
    setChangeRoleModal(false);
    setToastLoading("Change role of the forms...");
    setLoading(true);

    const response = await sendData("/form/update", {
      id: selected.toString(),
      role_id: roleRef.current.value,
    });

    if (!response) {
      setToastFailed("Failed to change role of the forms!");
      return;
    }

    setToastSuccess("Role of the forms have been changed successfully!");
    console.log(response);
    setSelected([]);

    const res = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/form`, {
        headers: {
          Authorization: `Bearer ${getCookie("user_token")}`,
        },
      })
      .then((res) => {
        return res.data.result?.cols?.data;
      })
      .catch((err) => {
        return null;
      });

    if (res) {
      setDataForm(res);
      setLoading(false);
    } else setToastFailed("Failed to get data!");
  };

  const changeStatusFormsHandler = async () => {
    setChangeStatusModal(false);
    setToastLoading("Change status of the forms...");
    setLoading(true);

    const response = await sendData("/form/update", {
      id: selected.toString(),
      status_id: statRef.current.value,
    });

    if (!response) {
      setToastFailed("Failed to change status of the forms!");
      return;
    }

    setToastSuccess("Status of the forms have been changed successfully!");
    console.log(response);
    setSelected([]);

    const res = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/form`, {
        headers: {
          Authorization: `Bearer ${getCookie("user_token")}`,
        },
      })
      .then((res) => {
        return res.data.result?.cols?.data;
      })
      .catch((err) => {
        return null;
      });

    if (res) {
      setDataForm(res);
      setLoading(false);
    } else setToastFailed("Failed to get data!");
  };

  return (
    <>
      {/* Delete modal */}
      <Modal title="Delete Forms" show={delModal} setShow={setDelModal}>
        <div className="px-5 py-2">Are you sure to delete the froms?</div>
        <div className="modal_buttons">
          <button className="_yellow" onClick={() => setDelModal(false)}>
            Cancel
          </button>
          <button className="_red" onClick={delFormsHandler}>
            Delete
          </button>
        </div>
      </Modal>
      {/* Delete modal end */}
      {/* Change role modal */}
      <Modal
        title="Change Form Role"
        show={changeRoleModal}
        setShow={setChangeRoleModal}
      >
        <div className="px-5 py-2">
          <label htmlFor="change-role" className="block">
            Change role to be
          </label>
          <select
            className="w-full _select_button"
            id="change-role"
            ref={roleRef}
          >
            {data.role.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="modal_buttons">
          <button className="_gray" onClick={() => setChangeRoleModal(false)}>
            Cancel
          </button>
          <button className="_blue" onClick={changeRoleFormsHandler}>
            Change
          </button>
        </div>
      </Modal>
      {/* Change role modal end */}
      {/* Change status modal */}
      <Modal
        title="Change Form Status"
        show={changeStatusModal}
        setShow={setChangeStatusModal}
      >
        <div className="px-5 py-2">
          <label htmlFor="change-status" className="block">
            Change status to be
          </label>
          <select
            className="w-full _select_button"
            id="change-status"
            ref={statRef}
          >
            {data.status.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="modal_buttons">
          <button className="_gray" onClick={() => setChangeStatusModal(false)}>
            Cancel
          </button>
          <button className="_blue" onClick={changeStatusFormsHandler}>
            Change
          </button>
        </div>
      </Modal>
      {/* Change status modal end */}
      <div className="min-h-screen bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-full overflow-hidden lg:h-screen _hide_scrollbar lg:flex-row">
          {/* Navbar */}
          <MyNavbar role_id={user.role_id} />
          {/* Navbar End */}

          <div className="flex flex-col w-full h-full gap-4 p-4 overflow-auto">
            {/* User info */}
            <UserDashboard pageName="Forms" user={user} />

            {/* Contents */}
            <div className="_myapp_content">
              <div className="_filters_container">
                {/* Search by name */}
                <form className="inline-flex items-center gap-2">
                  <div className="_filters_input_group ">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="_filters_icon"
                    />
                    <input
                      type="text"
                      className="_filters_input"
                      placeholder="Search by name"
                    />
                  </div>
                  <button type="submit" className="_filters_button">
                    Search
                  </button>
                </form>
                {/* Search by name End*/}

                {/* Filter by property */}
                <div className="_filters">
                  <select className="_select_button">
                    <option value="">View all roles</option>
                    <option value="1">Admin</option>
                    <option value="2">Student</option>
                    <option value="3">User</option>
                  </select>

                  <select
                    className="_select_button"
                    value={filter.limit}
                    onChange={(e) =>
                      setFilter({ ...filter, limit: e.target.value })
                    }
                  >
                    <option value="10">Rows: 10</option>
                    <option value="25">Rows: 25</option>
                    <option value="50">Rows: 50</option>
                    <option value="100">Rows: 100</option>
                  </select>
                </div>
                {/* Filter by property End */}

                {/* Selected */}
                <div className="_selected_container">
                  <div className="_selected_action">
                    <button
                      className="_green"
                      disabled={selected.length === 0 || loading}
                      onClick={() => setChangeStatusModal(true)}
                    >
                      Change status
                    </button>
                    <button
                      className="_yellow"
                      disabled={selected.length === 0 || loading}
                      onClick={() => setChangeRoleModal(true)}
                    >
                      Change role
                    </button>
                    <button
                      className="_red"
                      disabled={selected.length === 0 || loading}
                      onClick={() => setDelModal(true)}
                    >
                      Delete
                    </button>
                  </div>
                  <p className="_selected_counter">
                    {selected.length}
                    {" selected"}
                  </p>
                </div>
                {/* Selected End */}
              </div>
              {/* Table */}
              {loading ? (
                <SkeletonTable />
              ) : (
                <div className="_table_container">
                  <table className="table-auto">
                    <thead>
                      <tr>
                        {/* THead */}
                        <th scope="col">
                          <input type="checkbox" onChange={checkAllHandler} />
                        </th>
                        {data.rows.map((row, i) => (
                          <th key={i} scope="col">
                            {row}
                          </th>
                        ))}
                        <th scope="col">Action</th>
                        {/* THead end */}
                      </tr>
                    </thead>
                    <tbody>
                      {dataForm.map((col) => (
                        <tr key={col.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selected.includes(col.id)}
                              onChange={(e) => checkHandler(e, col.id)}
                            />
                          </td>
                          <td>{col.name}</td>
                          <td>{col.desc}</td>
                          <td>
                            <span className={`_pill _${col.status.style}`}>
                              {col.status.name}
                            </span>
                          </td>
                          <td>{col.role?.name}</td>
                          <td>{formatDate(col.created_at)}</td>
                          <td>{formatDate(col.updated_at)}</td>
                          <td>
                            <button className="px-3 py-1.5 bg-sky-200 text-sky-400 rounded-md w-full">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td></td>
                        <td>
                          <input
                            type="text"
                            placeholder="Name"
                            className="w-full disabled:bg-white"
                            onKeyDown={enterHandler}
                            value={newForm.name}
                            onChange={(e) =>
                              setNewForm({ ...newForm, name: e.target.value })
                            }
                            disabled={sending}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Desc"
                            className="w-full disabled:bg-white"
                            onKeyDown={enterHandler}
                            value={newForm.desc}
                            onChange={(e) =>
                              setNewForm({ ...newForm, desc: e.target.value })
                            }
                            disabled={sending}
                          />
                        </td>
                        <td>
                          <select
                            value={newForm.status_id}
                            onChange={(e) =>
                              setNewForm({
                                ...newForm,
                                status_id: e.target.value,
                              })
                            }
                          >
                            <option value="">Status</option>
                            {data.status.map((stat) => (
                              <option key={stat.id} value={stat.id}>
                                {stat.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            value={newForm.role_id}
                            onChange={(e) =>
                              setNewForm({
                                ...newForm,
                                role_id: e.target.value,
                              })
                            }
                          >
                            <option value="">Role</option>
                            {data.role.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td></td>
                        <td></td>
                        <td>
                          <button
                            className="px-3 py-1.5 bg-green-200 text-green-400 rounded-md disabled:bg-gray-300 disabled:text-gray-400"
                            onClick={newFormHandler}
                            disabled={newForm.name.length <= 6}
                          >
                            Create
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {/* Table End */}
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
  if (!isAdmin(user))
    return {
      redirect: {
        destination: "/my-app",
        permanent: false,
      },
    };

  const data = await fetchData("/form", req, res);

  return { props: { user, data } };
}
