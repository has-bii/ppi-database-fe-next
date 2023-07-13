import MyNavbar from "@components/MyNavbar";
import UserDashboard from "@components/UserDashboard";
import { faFilter, faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isAdmin } from "@lib/isAdmin";
import axios from "axios";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function index({ user, data, cookie }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [users, setUsers] = useState(data);
  const filterName = useRef();
  const [filterAdmin, setFilterAdmin] = useState(false);
  const [filterStudent, setFilterStudent] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterUnverified, setFilterUnverified] = useState(false);

  const formatDate = (timestamp) => {
    const d = new Date(timestamp);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Des",
    ];

    const date = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();

    const time = `${date}-${months[month]}-${year}`;

    return time;
  };

  useEffect(() => {
    console.log(users);
  }, []);

  const fetchUsers = async (url) => {
    if (!url) return;

    const res = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
        params: {
          limit: 10,
        },
      })
      .then((res) => {
        return res.data.result;
      });

    setUsers(res);
  };

  const searchHandler = () => {
    console.log(filterName.current.value);
  };

  const enterHandler = (e) => {
    e.preventDefault();
    console.log("test");
  };

  return (
    <div className="bg-base-grey">
      <Head>
        <title>My App | PPI Karabük</title>
      </Head>
      <div className="flex flex-col w-screen h-screen overflow-hidden lg:flex-row">
        <MyNavbar role_id={user.role_id} />
        <div className="flex flex-col w-full gap-4 p-4">
          <UserDashboard pageName="Users" user={user} />
          <div className="w-full h-full gap-4 overflow-auto _hide_scrollbar _card_myapp">
            {/* Contents */}
            <div className="_filters_container _hide_scrollbar">
              <div className="_filters_input_group">
                <FontAwesomeIcon icon={faSearch} className="_filters_icon" />
                <input
                  type="text"
                  id="searchName"
                  className="_filters_input"
                  placeholder="Search by name"
                  ref={filterName}
                />
              </div>
              <button
                onClick={searchHandler}
                onKeyUp={enterHandler}
                className="_filters_button"
              >
                Search
              </button>
              <div className="_filters">
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
                {filterAdmin && (
                  <button
                    className="_filter_value _green"
                    onClick={() => setFilterAdmin(!filterAdmin)}
                  >
                    Admin
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
                {filterStudent && (
                  <button
                    className="_filter_value _blue"
                    onClick={() => setFilterStudent(!filterStudent)}
                  >
                    Student
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
                {filterVerified && (
                  <button
                    className="_filter_value _red"
                    onClick={() => setFilterVerified(!filterVerified)}
                  >
                    Verified
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
                {filterUnverified && (
                  <button
                    className="_filter_value _yellow"
                    onClick={() => setFilterUnverified(!filterUnverified)}
                  >
                    Unverified
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-hidden border border-black rounded-lg w-fit lg:w-full">
              <table className="table-auto">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col">Enrolled</th>
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
                        <button className="_action_btn _green">Verify</button>
                        <button className="_action_btn _yellow">Role</button>
                        <button className="_action_btn _red">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="_pagination">
                {users.prev_page_url ? (
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

                <div className="text-gray-500 ">{`Page ${users.from} of ${users.last_page}`}</div>
                {users.next_page_url ? (
                  <button
                    className="_pagination_button"
                    onClick={() => fetchUsers(users.next_page_url)}
                  >
                    Prev
                  </button>
                ) : (
                  <button className="_pagination_button" disabled>
                    Prev
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      deleteCookie("user_token", { req, res });
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    });

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
    .catch(() => {
      return null;
    });

  return { props: { user, data, cookie } };
}
