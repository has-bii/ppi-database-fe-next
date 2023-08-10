import Modal from "@components/Modal";
import MyNavbar from "@components/MyNavbar";
import SkeletonTable from "@components/SkeletonTable";
import UserDashboard from "@components/UserDashboard";
import {
  faCircle,
  faPlus,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteData } from "@lib/deleteData";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import { formatDate } from "@lib/formatDate";
import { isAdmin } from "@lib/isRole";
import { sendData } from "@lib/sendData";
import { useToastContext } from "@components/ToastContext";
import axios from "axios";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { getNavbarData } from "@lib/getNavbarData";

export default function index({ user, data, navbarData }) {
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();
  const [dataForm, setDataForm] = useState(data?.cols?.data);
  const [delModal, setDelModal] = useState(false);
  const [changeRoleModal, setChangeRoleModal] = useState(false);
  const [changeStatusModal, setChangeStatusModal] = useState(false);
  const roleRef = useRef();
  const statRef = useRef();
  const [question, setQuestion] = useState([]);
  const [selectedForm, setSelectedForm] = useState({
    // id: 42,
    // name: "Pendaftaran S1 Jalur Berkas Karabük University 2023/2024",
    // desc: "Dibuka hanya lewat untuk 15 orang",
    // status_id: 1,
    // role_id: 3,
    // created_at: "2023-08-02T18:32:51.000000Z",
    // updated_at: "2023-08-02T18:32:51.000000Z",
    // status: {
    //   id: 1,
    //   name: "open",
    //   style: "success",
    // },
    // role: {
    //   id: 3,
    //   name: "User",
    // },
  });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [sending, setSending] = useState(false);
  const [timerID, setTimerID] = useState();
  const [filter, setFilter] = useState({
    name: "",
    status_id: "",
    role_id: "",
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

  const fetchHandler = (e) => {
    e.preventDefault();

    fetchForm();
  };

  const fetchForm = async () => {
    setLoading(true);

    const res = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/form`, {
        headers: {
          Authorization: `Bearer ${getCookie("user_token")}`,
        },
        params: filter,
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

    fetchForm();
  };

  const changeQuestionType = (index, value, property) => {
    const updatedQuestion = question.map((q, i) => {
      if (index === i) {
        q[property] = value;

        return q;
      } else return q;
    });

    setQuestion(updatedQuestion);
  };

  const pushOption = (index, value) => {
    const updatedQuestion = question.map((q, i) => {
      if (index === i) {
        q.option.push(value);

        return q;
      } else return q;
    });

    setQuestion(updatedQuestion);
  };

  const saveForm = async () => {
    let data = selectedForm;
    data.question = question;
    setToastLoading("Saving...");
    const response = await sendData("/form/update", data);

    if (!response) {
      setToastFailed("Failed to save...");
      return;
    }

    setToastSuccess("Saved successfully...");
  };

  useEffect(() => {
    if (Object.keys(question).length) {
      clearTimeout(timerID);

      setTimerID(
        setTimeout(async () => {
          await saveForm();
        }, 2000)
      );
    }
  }, [question]);

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
          <MyNavbar role_id={user.role_id} data={navbarData} />
          {/* Navbar End */}

          <div className="flex flex-col w-full h-full gap-4 p-4 overflow-auto">
            {/* User info */}
            <UserDashboard pageName="Forms" user={user} />

            {/* Contents */}
            {Object.keys(selectedForm).length === 0 ? (
              <div className="myapp_content">
                <div className="_filters_container">
                  {/* Search by name */}
                  <form
                    className="inline-flex items-center gap-2"
                    onSubmit={fetchHandler}
                  >
                    <div className="_filters_input_group ">
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="_filters_icon"
                      />
                      <input
                        type="text"
                        className="_filters_input"
                        placeholder="Search by name"
                        value={filter.name}
                        onChange={(e) =>
                          setFilter({ ...filter, name: e.target.value })
                        }
                      />
                    </div>
                    <button type="submit" className="_filters_button">
                      Search
                    </button>
                  </form>
                  {/* Search by name End*/}

                  {/* Filter by property */}
                  <div className="_filters">
                    <select
                      className="_select_button"
                      value={filter.role_id}
                      onChange={(e) =>
                        setFilter({ ...filter, role_id: e.target.value })
                      }
                    >
                      <option value="">View all roles</option>
                      {data.role.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
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
                          {data.rows.map((row, i) =>
                            row !== "question" ? (
                              <th key={i} scope="col">
                                {row}
                              </th>
                            ) : (
                              ""
                            )
                          )}
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
                              <button
                                className="px-3 py-1.5 bg-sky-200 text-sky-400 rounded-md w-full"
                                onClick={() => {
                                  setSelectedForm(col);
                                  setQuestion(col.question);
                                }}
                              >
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
            ) : (
              <div className="myapp_content">
                <div className="flex flex-row w-full gap-2">
                  <button
                    className="px-4 py-2 ml-auto text-white rounded-md bg-sky-500"
                    onClick={saveForm}
                  >
                    Save
                  </button>
                  <button
                    className="px-4 py-2 border rounded-md text-sky-500 border-sky-500"
                    onClick={() => {
                      setSelectedForm({});
                      setQuestion([]);
                    }}
                  >
                    Back
                  </button>
                </div>
                <div className="relative flex flex-col justify-center w-full gap-4 py-8 rounded-md px-28 bg-base-grey">
                  <div className="px-8 py-4 bg-white border-t-8 rounded border-sky-500">
                    <h2 className="text-2xl font-semibold ">
                      <input
                        type="text"
                        className="w-full"
                        value={selectedForm.name}
                        onChange={(e) =>
                          setSelectedForm({
                            ...selectedForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </h2>
                    <p className="text-lg text-gray-400 ">
                      <input
                        type="text"
                        className="w-full"
                        placeholder="Form description"
                        value={selectedForm.desc}
                        onChange={(e) =>
                          setSelectedForm({
                            ...selectedForm,
                            desc: e.target.value,
                          })
                        }
                      />
                    </p>
                  </div>
                  {question.map((q, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-4 px-8 py-4 bg-white rounded"
                    >
                      <div className="inline-flex justify-between">
                        <input
                          type="text"
                          placeholder="Question"
                          className="w-full"
                          value={q.label}
                          onChange={(e) =>
                            changeQuestionType(i, e.target.value, "label")
                          }
                        />
                        <select
                          value={q.type}
                          onChange={(e) =>
                            changeQuestionType(i, e.target.value, "type")
                          }
                        >
                          <option value="text">Short answer text</option>
                          <option value="radio">Multiple choice</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2 mb-2">
                        {q.type === "text" ? (
                          <p className="text-gray-300 px-3 py-1.5 border rounded-lg border-black min-w-[10rem] w-fit">
                            Short answer
                          </p>
                        ) : q.type === "radio" ? (
                          <>
                            {q.option.map((opt, index) => (
                              <div
                                key={index}
                                className="inline-flex items-center gap-4"
                              >
                                <FontAwesomeIcon icon={faCircle} />
                                <p>{opt}</p>
                              </div>
                            ))}
                            <div className="inline-flex items-center gap-4">
                              <FontAwesomeIcon icon={faCircle} />
                              <input
                                type="text"
                                placeholder="Add option"
                                className="border-b border-gray-300 w-fit"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    pushOption(i, e.target.value);
                                    e.target.value = "";
                                  }
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="flex justify-end py-2 border-t border-gray-300">
                        <button
                          className="px-3 py-1.5 rounded bg-red-400 text-white"
                          onClick={() =>
                            setQuestion(
                              question.filter((ques, index) => index !== i)
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 mx-auto text-white rounded bg-sky-500 w-fit"
                    onClick={() =>
                      setQuestion((prev) => [
                        ...prev,
                        {
                          form_id: selectedForm.id,
                          label: "",
                          type: "text",
                          option: [],
                        },
                      ])
                    }
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add question
                  </button>
                </div>
              </div>
            )}
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

  var data = await fetchData("/form", req, res, { limit: 10 });

  if (data)
    data.cols.data.map((form) => {
      form.question = JSON.parse(form.question);
    });

  const navbarData = await getNavbarData({ req, res });

  return { props: { user, data, navbarData } };
}
