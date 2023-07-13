import Alert from "@components/Alert";
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
import { isAdmin } from "@lib/isAdmin";
import axios from "axios";
import { getCookie, hasCookie } from "cookies-next";
import { formatDate } from "@lib/formatDate";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function index({ user, data, cookie }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [users, setUsers] = useState(data);
  const didMount = useRef(false);
  const filterName = useRef();
  const [filterAdmin, setFilterAdmin] = useState(false);
  const [filterStudent, setFilterStudent] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterUnverified, setFilterUnverified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});
  const [sortBy, setSortBy] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    created_at: "",
  });
  const [select, setSelect] = useState();
  const [modal, setModal] = useState({
    show: false,
    header: "",
    select: {},
  });
  const [modal2, setModal2] = useState({
    show: false,
    select: {},
  });

  const fetchUsers = async (
    url = `${process.env.NEXT_PUBLIC_API_URL}/users`
  ) => {
    setLoading(true);

    const res = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
        params: {
          limit: 10,
          name: filterName.current.value,
          is_verified:
            filterUnverified == filterVerified ? "" : filterUnverified ? 1 : 2,
          role_id:
            filterStudent && filterAdmin
              ? "1,2"
              : filterStudent
              ? 1
              : filterAdmin
              ? 2
              : "",
          order_by_name: sortBy.name,
          order_by_email: sortBy.email,
          order_by_role_id: sortBy.role,
          order_by_is_verified: sortBy.status,
          order_by_created_at: sortBy.created_at,
        },
      })
      .then((res) => {
        return res.data.result;
      })
      .catch((err) => {
        console.error(err.response);

        return null;
      });

    if (res) {
      setUsers(res);
      setLoading(false);
    } else setAlert({ message: "Server-side error occurred!", status: false });
  };

  const searchHandler = () => {
    fetchUsers();
  };

  const verify = async (id) => {
    setLoading(true);

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/update-users`,
        {
          id: id,
          is_verified: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        }
      )
      .then((res) => {
        setAlert({ message: res.data.meta.message, status: true });
        fetchUsers();
      })
      .catch((err) => {
        setAlert({ message: err.response.data.meta.message, status: false });
      });
  };

  const changeRole = async (id) => {
    setModal2({ ...modal2, show: false });
    setLoading(true);

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/update-users`,
        {
          id: id,
          role_id: select,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        }
      )
      .then((res) => {
        setAlert({ message: res.data.meta.message, status: true });
        fetchUsers();
      })
      .catch((err) => {
        setAlert({ message: err.response.data.meta.message, status: false });
      });
  };

  const deleteUser = async () => {
    setModal({ ...modal, show: false });

    setLoading(true);

    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/delete`, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
        data: {
          id: modal.select.id,
        },
      })
      .then((res) => {
        setAlert({ message: res.data.meta.message, status: true });
        fetchUsers();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    if (didMount.current) {
      fetchUsers();
      console.log("Fetching");
    } else didMount.current = true;
  }, [filterAdmin, filterStudent, filterVerified, filterUnverified, sortBy]);

  return (
    <>
      <Alert alert={alert} setAlert={setAlert} />

      {/* Modal */}
      <div className={`_modal_container ${modal.show ? "_show" : ""}`}>
        <div className="_modal">
          <div className="_modal_header">
            {modal.header}
            <button onClick={() => setModal({ ...modal, show: false })}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <div className="_modal_body">{`Are you sure to delete ${modal.select.name}`}</div>
          <div className="_modal_buttons">
            <button
              className="_green"
              onClick={() => setModal({ ...modal, show: false })}
            >
              Cancel
            </button>
            <button className="_red" onClick={deleteUser}>
              Delete
            </button>
          </div>
        </div>
      </div>
      {/* Modal End */}

      {/* Modal */}
      <div className={`_modal_container ${modal2.show ? "_show" : ""}`}>
        <div className="_modal">
          <div className="_modal_header">
            Change Role
            <button onClick={() => setModal2({ ...modal2, show: false })}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <div className="_modal_body">
            <label>
              Change role to be
              <select
                className="_label_select"
                value={select}
                onChange={(e) => setSelect(e.target.value)}
              >
                <option value="1">Student</option>
                <option value="2">Admin</option>
                <option value="3">User</option>
              </select>
            </label>
          </div>
          <div className="_modal_buttons">
            <button
              className="_green"
              onClick={() => setModal2({ ...modal2, show: false })}
            >
              Cancel
            </button>
            <button
              className="_yellow"
              onClick={() => changeRole(modal2.select.id)}
            >
              Change
            </button>
          </div>
        </div>
      </div>
      {/* Modal End */}

      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-screen overflow-auto _hide_scrollbar lg:flex-row">
          <MyNavbar role_id={user.role_id} />
          <div className="flex flex-col w-full gap-4 p-4">
            <UserDashboard pageName="Users" user={user} />
            <div className="w-full h-full gap-4 overflow-auto _hide_scrollbar _card_myapp">
              {/* Contents */}
              <div className="_filters_container _hide_scrollbar">
                <div className="_filters_input_group ">
                  <FontAwesomeIcon icon={faSearch} className="_filters_icon" />
                  <input
                    type="text"
                    id="searchName"
                    className="_filters_input"
                    placeholder="Search by name"
                    ref={filterName}
                  />
                </div>
                <button onClick={searchHandler} className="_filters_button">
                  Search
                </button>

                {/* Filter */}
                <div className="_dropdown_container">
                  <button
                    type="submit"
                    className="_filters_button _white"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <FontAwesomeIcon icon={faFilter} />
                    Filter
                  </button>
                  <ul
                    className={`_dropdown_list ${showDropdown ? "_show" : ""}`}
                  >
                    <li>
                      <label htmlFor="admin">Admin</label>
                      <input
                        type="checkbox"
                        checked={filterAdmin}
                        id="admin"
                        onChange={() => setFilterAdmin(!filterAdmin)}
                      />
                    </li>
                    <li>
                      <label htmlFor="student">Student</label>
                      <input
                        type="checkbox"
                        checked={filterStudent}
                        id="student"
                        onChange={() => setFilterStudent(!filterStudent)}
                      />
                    </li>
                    <li>
                      <label htmlFor="verified">Verified</label>
                      <input
                        type="checkbox"
                        checked={filterVerified}
                        id="verified"
                        onChange={() => setFilterVerified(!filterVerified)}
                      />
                    </li>
                    <li>
                      <label htmlFor="unverified">Unverified</label>
                      <input
                        type="checkbox"
                        checked={filterUnverified}
                        id="unverified"
                        onChange={() => setFilterUnverified(!filterUnverified)}
                      />
                    </li>
                  </ul>
                </div>
                {/* Sort */}
                <div className="_dropdown_container">
                  <button
                    type="submit"
                    className="_filters_button _white"
                    onClick={() => setShowDropdown2(!showDropdown2)}
                  >
                    <FontAwesomeIcon icon={faArrowDownWideShort} />
                    Sort
                  </button>
                  <ul
                    className={`_dropdown_list ${showDropdown2 ? "_show" : ""}`}
                  >
                    <li>
                      <label className="_label_select">
                        Name
                        <select
                          value={sortBy.name}
                          onChange={(e) =>
                            setSortBy({ ...sortBy, name: e.target.value })
                          }
                        >
                          <option value="">None</option>
                          <option value="asc">asc</option>
                          <option value="desc">desc</option>
                        </select>
                      </label>
                    </li>
                    <li>
                      <label className="_label_select">
                        Email
                        <select
                          value={sortBy.email}
                          onChange={(e) =>
                            setSortBy({ ...sortBy, email: e.target.value })
                          }
                        >
                          <option value="">None</option>
                          <option value="asc">asc</option>
                          <option value="desc">desc</option>
                        </select>
                      </label>
                    </li>
                    <li>
                      <label className="_label_select">
                        Role
                        <select
                          value={sortBy.role}
                          onChange={(e) =>
                            setSortBy({ ...sortBy, role: e.target.value })
                          }
                        >
                          <option value="">None</option>
                          <option value="asc">asc</option>
                          <option value="desc">desc</option>
                        </select>
                      </label>
                    </li>
                    <li>
                      <label className="_label_select">
                        Status
                        <select
                          value={sortBy.status}
                          onChange={(e) =>
                            setSortBy({ ...sortBy, status: e.target.value })
                          }
                        >
                          <option value="">None</option>
                          <option value="asc">asc</option>
                          <option value="desc">desc</option>
                        </select>
                      </label>
                    </li>
                    <li>
                      <label className="_label_select">
                        Enrolled
                        <select
                          value={sortBy.created_at}
                          onChange={(e) =>
                            setSortBy({ ...sortBy, created_at: e.target.value })
                          }
                        >
                          <option value="">None</option>
                          <option value="asc">asc</option>
                          <option value="desc">desc</option>
                        </select>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
              {loading ? (
                <SkeletonTable />
              ) : (
                <div className="overflow-auto border border-black rounded-lg w-fit lg:w-full _hide_scrollbar">
                  <table className="table-auto">
                    <thead>
                      <tr>
                        <th scope="col">
                          <span>
                            Name
                            {sortBy.name ? (
                              sortBy.name === "asc" ? (
                                <FontAwesomeIcon icon={faArrowUp} />
                              ) : (
                                <FontAwesomeIcon icon={faArrowDown} />
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </th>
                        <th scope="col">
                          <span>
                            Email
                            {sortBy.email ? (
                              sortBy.email === "asc" ? (
                                <FontAwesomeIcon icon={faArrowUp} />
                              ) : (
                                <FontAwesomeIcon icon={faArrowDown} />
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </th>
                        <th scope="col">
                          <span>
                            Role
                            {sortBy.role ? (
                              sortBy.role === "asc" ? (
                                <FontAwesomeIcon icon={faArrowUp} />
                              ) : (
                                <FontAwesomeIcon icon={faArrowDown} />
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </th>
                        <th scope="col">
                          <span>
                            Status
                            {sortBy.status ? (
                              sortBy.status === "asc" ? (
                                <FontAwesomeIcon icon={faArrowUp} />
                              ) : (
                                <FontAwesomeIcon icon={faArrowDown} />
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </th>
                        <th scope="col">
                          <span>
                            Enrolled
                            {sortBy.created_at ? (
                              sortBy.created_at === "asc" ? (
                                <FontAwesomeIcon icon={faArrowUp} />
                              ) : (
                                <FontAwesomeIcon icon={faArrowDown} />
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.data.map((u, i) => (
                        <tr key={i}>
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
                          <td className="flex gap-2">
                            <button
                              className="_action_btn _green"
                              onClick={() => verify(u.id)}
                            >
                              Verify
                            </button>
                            <button
                              className="_action_btn _yellow"
                              onClick={() => {
                                setModal2({ show: true, select: u });
                                setSelect(u.role_id.toString());
                              }}
                            >
                              Role
                            </button>
                            <button
                              className="_action_btn _red"
                              onClick={() =>
                                setModal({
                                  show: true,
                                  header: "Delete User",
                                  select: u,
                                })
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="_pagination">
                {users.prev_page_url && !loading ? (
                  <button
                    className="_pagination_button"
                    onClick={() => fetchUsers(users.prev_page_url)}
                  >
                    Prev
                  </button>
                ) : (
                  <button className="_pagination_button" disabled>
                    Prev
                  </button>
                )}

                {!loading && (
                  <div className="text-gray-500 ">
                    {`Page ${users.current_page} of ${users.last_page} | Number of users is `}
                    <b>{users.total}</b>
                  </div>
                )}
                {users.next_page_url && !loading ? (
                  <button
                    className="_pagination_button"
                    onClick={() => fetchUsers(users.next_page_url)}
                  >
                    Next
                  </button>
                ) : (
                  <button className="_pagination_button" disabled>
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  let cookie = hasCookie("user_token", { req, res });

  if (!cookie) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  cookie = getCookie("user_token", { req, res });

  // Fetching user data
  const user = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    })
    .then((res) => {
      return res.data.result;
    })
    .catch((err) => {
      return null;
    });

  if (!user)
    return {
      redirect: {
        destination: "/500",
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

  const data = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
      params: {
        limit: 10,
      },
    })
    .then((res) => {
      return res.data.result;
    })
    .catch((err) => {
      return null;
    });

  return { props: { user, data, cookie } };
}
