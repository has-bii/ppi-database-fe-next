import MyNavbar from "@components/MyNavbar";
import SkeletonTable from "@components/SkeletonTable";
import UserDashboard from "@components/UserDashboard";
import {
  faArrowDown,
  faArrowDownWideShort,
  faArrowUp,
  faFilter,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { formatDate } from "@lib/formatDate";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { fetchUser } from "@lib/fetchUser";
import { fetchData } from "@lib/fetchData";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import { isPPMB } from "@lib/isRole";
import { useToastContext } from "@components/ToastContext";
import { getNavbarData } from "@lib/getNavbarData";

const rows = ["name", "email", "role_id", "is_verified", "created_at"];

export default function Index({ user, data, navbarData }) {
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();
  const cookie = getCookie("user_token");
  const [datas, setDatas] = useState(data);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    modal1: false,
  });
  const [selected, setSelected] = useState([]);
  const didMounted = useRef(false);
  const roleValue = useRef();
  const [filter, setFilter] = useState({
    limit: 10,
    name: "",
    email: "",
    role_id: "3",
    is_verified: "0",
    order_field: "created_at",
    order_by: "desc",
  });

  const fetchUsers = async (
    url = `${process.env.NEXT_PUBLIC_API_URL}/api/users`
  ) => {
    setLoading(true);
    setSelected([]);

    const res = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
        params: filter,
      })
      .then((res) => {
        return res.data.result;
      })
      .catch((err) => {
        console.error(err.response);
        return null;
      });

    if (res) {
      setDatas(res);
      setLoading(false);
    } else setToastFailed("Server-side error occurred!");
  };

  const checkHandler = (e, id) => {
    if (e.target.checked) setSelected((old) => [...old, id]);
    else setSelected(selected.filter((prev) => prev !== id));
  };

  const checkAllHandler = (e) => {
    if (e.target.checked) setSelected(datas.data.map((d) => d.id));
    else setSelected([]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const orderHandler = (field) => {
    if (filter.order_field === field)
      filter.order_by === "asc"
        ? setFilter({ ...filter, order_by: "desc" })
        : filter.order_by === "desc"
        ? setFilter({ ...filter, order_by: "", order_field: "" })
        : setFilter({ ...filter, order_by: "asc" });
    else setFilter({ ...filter, order_field: field, order_by: "asc" });
  };

  const updateUsersHandler = async (is_verified = 0, role_id = 0) => {
    setToastLoading("Sending data to the server...");

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/update-users`,
        {
          id: selected.toString(),
          role_id: role_id,
          is_verified: is_verified,
        },
        {
          headers: { Authorization: `Bearer ${cookie}` },
        }
      )
      .then((res) => {
        setToastSuccess("Updated successfully");
        fetchUsers();
      })
      .catch((err) => {
        console.error(err);
        setToastFailed("Server-side error occurred!");
      });
  };

  const deleteUsersHandler = async () => {
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/api/delete`, {
        headers: { Authorization: `Bearer ${cookie}` },
        data: {
          id: selected.toString(),
        },
      })
      .then((res) => {
        setToastSuccess(res.data.meta.message);
        fetchUsers();
      })
      .catch((err) => {
        console.error(err);
        setToastFailed("Server-side error occurred!");
      });
  };

  useEffect(() => {
    if (didMounted.current) fetchUsers();
    else didMounted.current = true;
  }, [
    filter.is_verified,
    filter.role_id,
    filter.order_field,
    filter.order_by,
    filter.limit,
  ]);

  return (
    <>
      {/* Modal verify */}
      <div className={`_modal_container ${modal.modal1 ? "_show" : ""}`}>
        <div className="_modal">
          <div className="_modal_header">
            Verify User
            <button onClick={() => setModal({ ...modal, modal1: false })}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <div className="_modal_body">
            Are you sure to verify selected users
          </div>
          <div className="_modal_buttons">
            <button
              className="_green"
              onClick={() => {
                setModal({ ...modal, modal1: false });
                setSelected([]);
              }}
            >
              Cancel
            </button>
            <button
              className="_yellow"
              onClick={() => {
                setModal({ ...modal, modal1: false });
                updateUsersHandler(1);
              }}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
      {/* Modal verify end */}

      <div className="min-h-screen bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-screen overflow-auto lg:flex-row _hide_scrollbar">
          {/* Navbar */}
          <MyNavbar role_id={user.role_id} data={navbarData} />
          {/* Navbar End */}

          <div className="flex flex-col w-full gap-4 p-4">
            {/* User info */}
            <UserDashboard pageName="Users" user={user} />

            {/* Contents */}
            <div className="myapp_content">
              <div className="_filters_container">
                {/* Search by name */}
                <form
                  className="inline-flex items-center gap-2"
                  onSubmit={submitHandler}
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
                    value={filter.is_verified}
                    onChange={(e) =>
                      setFilter({ ...filter, is_verified: e.target.value })
                    }
                  >
                    <option value="0">View all statuses</option>
                    <option value="1">Unverified</option>
                    <option value="2">Verified</option>
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
                      onClick={() => setModal({ ...modal, modal1: true })}
                      disabled={selected.length === 0}
                    >
                      Verify
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
                        <th scope="col">
                          <input type="checkbox" onChange={checkAllHandler} />
                        </th>

                        {/* Table Head */}
                        {rows.map((r, i) => (
                          <th key={i} scope="col">
                            <button
                              className="_row_table"
                              onClick={() => orderHandler(r)}
                            >
                              {i === 2
                                ? "role"
                                : i === 3
                                ? "status"
                                : i === 4
                                ? "enrolled"
                                : r}
                              {filter.order_field === r && (
                                <FontAwesomeIcon
                                  icon={
                                    filter.order_by === "asc"
                                      ? faArrowUp
                                      : faArrowDown
                                  }
                                />
                              )}
                            </button>
                          </th>
                        ))}
                        {/* Table Head End */}
                      </tr>
                    </thead>
                    <tbody>
                      {datas.data.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selected.includes(u.id)}
                              onChange={(e) => checkHandler(e, u.id)}
                            />
                          </td>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.role.name}</td>
                          <td>
                            {u.is_verified ? (
                              <span className="_pill _success">Verified</span>
                            ) : (
                              <span className="_pill _error">Unverified</span>
                            )}
                          </td>
                          <td>{formatDate(u.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Table End */}

              {/* Pagination */}
              <div className="_pagination_container">
                <div className="_pagination">
                  <button
                    className="_pagination_button"
                    disabled={loading || (datas.prev_page_url ? false : true)}
                    onClick={() => fetchUsers(datas.prev_page_url)}
                  >
                    Prev
                  </button>
                  <div className="_pagination_info">{`${datas.current_page} of ${datas.last_page} | Total ${datas.total}`}</div>
                  <button
                    className="_pagination_button"
                    disabled={loading || (datas.next_page_url ? false : true)}
                    onClick={() => fetchUsers(datas.next_page_url)}
                  >
                    Next
                  </button>
                </div>
              </div>
              {/* Pagination End */}
            </div>

            {/* Contents End */}
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

  const params = {
    limit: 10,
    order_field: "created_at",
    order_by: "desc",
    role_id: 3,
  };

  const data = await fetchData("/users", req, res, params);

  const navbarData = await getNavbarData({ req, res });

  return { props: { user, data, navbarData } };
}
