import MyNavbar from "@components/MyNavbar";
import SkeletonTable from "@components/SkeletonTable";
import UserDashboard from "@components/UserDashboard";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from "@lib/formatDate";
import axios from "axios";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function index({ user, students, cookie }) {
  const [loading, setLoading] = useState(false);
  const didMounted = useRef(false);
  const [datas, setDatas] = useState(students);
  const [selected, setSelected] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [rows, setRows] = useState([
    { name: "name", show: true },
    { name: "email", show: false },
    { name: "kelamin", show: true },
    { name: "whatsapp", show: true },
    { name: "no aktif", show: false },
    { name: "kimlik", show: false },
    { name: "kimlik exp", show: false },
    { name: "paspor", show: false },
    { name: "paspor exp", show: false },
    { name: "tanggal lahir", show: false },
    { name: "provinsi", show: false },
    { name: "asal kota", show: false },
    { name: "alamat ID", show: false },
    { name: "kota TR", show: true },
    { name: "alamat TR", show: false },
    { name: "kedatangan", show: true },
    { name: "pendidikan", show: true },
    { name: "universitas", show: true },
    { name: "jurusan", show: true },
    { name: "kelas", show: true },
    { name: "enrolled at", show: true },
    { name: "updated at", show: true },
  ]);
  const [filter, setFilter] = useState({
    limit: "10",
    name: "",
  });

  const checkHandler = (e, id) => {
    if (e.target.checked) setSelected((old) => [...old, id]);
    else setSelected(selected.filter((prev) => prev !== id));
  };

  const checkAllHandler = (e) => {
    if (e.target.checked) setSelected(students.data.map((d) => d.id));
    else setSelected([]);
  };

  const fetchStudents = async (
    url = `${process.env.NEXT_PUBLIC_API_URL}/api/student/fetch_students`
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
    } else setAlert({ message: "Server-side error occurred!", status: false });
  };

  const checkRowHandler = (index) => {
    const updated = rows.map((row, i) => {
      if (i === index) {
        row.show = !row.show;

        return row;
      } else {
        return row;
      }
    });

    setRows(updated);
  };

  useEffect(() => {
    if (didMounted.current) fetchStudents();
    else didMounted.current = true;
  }, [filter.limit]);

  return (
    <>
      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-full overflow-hidden lg:h-screen _hide_scrollbar lg:flex-row">
          {/* Navbar */}
          <MyNavbar role_id={user.role_id} />
          {/* Navbar End */}

          <div className="flex flex-col w-full h-full gap-4 p-4 overflow-auto">
            {/* User info */}
            <UserDashboard pageName="Students Database" user={user} />
            {/* User info end */}

            {/* Content */}
            <div className="relative _myapp_content">
              {/* Filter container */}
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

                {/* Shown Rows container */}
                <div className="_dropdown_container">
                  <button
                    className="_dropdown_button"
                    onClick={() => setDropdown(!dropdown)}
                  >
                    Shown rows
                  </button>
                  <div className={`_dropdown_list ${dropdown ? "_show" : ""}`}>
                    <p className="font-semibold">Shown rows:</p>
                    <ul className="text-gray-500">
                      {rows.map((row, index) => (
                        <li key={index}>
                          <label htmlFor={index}>{row.name}</label>
                          <input
                            type="checkbox"
                            id={index}
                            checked={row.show}
                            onChange={() => checkRowHandler(index)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Shown Rows end */}

                {/* Filter by property */}
                <div className="_filters">
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
                      className="_yellow"
                      disabled={selected.length === 0}
                      onClick={() => setModal({ ...modal, modal2: true })}
                    >
                      Change role
                    </button>
                    <button
                      className="_red"
                      onClick={() => setModal({ ...modal, modal3: true })}
                      disabled={selected.length === 0}
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
              {/* Filter end */}

              {/* Table */}
              {loading ? (
                <SkeletonTable />
              ) : (
                <div className="h-full overflow-auto border border-black rounded-lg _hide_scrollbar">
                  <table className="table-auto">
                    <thead>
                      <tr>
                        <th scope="col">
                          <input type="checkbox" onChange={checkAllHandler} />
                        </th>
                        {rows.map(
                          (row, index) =>
                            row.show && <th key={index}>{row.name}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {datas.data.map((data, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selected.includes(data.id)}
                              onChange={(e) => checkHandler(e, data.id)}
                            />
                          </td>
                          {rows.map(
                            (row, index) =>
                              row.show && (
                                <td
                                  key={index}
                                  className={
                                    row.name === "alamat ID" ||
                                    row.name === "alamat TR"
                                      ? "_wider_col"
                                      : ""
                                  }
                                >
                                  {row.name === "name" && data.name}
                                  {row.name === "email" && data.email}
                                  {row.name === "kelamin" && data.jenis_kelamin}
                                  {row.name === "whatsapp" && data.whatsapp}
                                  {row.name === "no aktif" && data.no_aktif}
                                  {row.name === "kimlik" && data.tc_kimlik}
                                  {row.name === "kimlik exp" && data.kimlik_exp}
                                  {row.name === "paspor" && data.no_paspor}
                                  {row.name === "paspor exp" && data.paspor_exp}
                                  {row.name === "tanggal lahir" &&
                                    data.tanggal_lahir}
                                  {row.name === "provinsi" &&
                                    data.provinsi_indonesia}
                                  {row.name === "asal kota" &&
                                    data.kota_asal_indonesia}
                                  {row.name === "alamat ID" &&
                                    data.alamat_lengkap_indonesia}
                                  {row.name === "kota TR" &&
                                    data.kota_turki?.name}
                                  {row.name === "alamat TR" &&
                                    data.alamat_turki}
                                  {row.name === "kedatangan" &&
                                    data.tahun_kedatangan}
                                  {row.name === "universitas" &&
                                    data.universitas_turki?.name}
                                  {row.name === "jurusan" && data.jurusan?.name}
                                  {row.name === "pendidikan" &&
                                    data.jenjang_pendidikan}
                                  {row.name === "kelas" && data.tahun_ke}
                                  {row.name === "enrolled at" &&
                                    formatDate(data.created_at)}
                                  {row.name === "updated at" &&
                                    formatDate(data.updated_at)}
                                </td>
                              )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Table end */}

              {/* Pagination */}
              <div className="_pagination_container">
                <div className="_pagination">
                  <button
                    className="_pagination_button"
                    disabled={loading || (datas.prev_page_url ? false : true)}
                    onClick={() => fetchStudents(datas.prev_page_url)}
                  >
                    Prev
                  </button>
                  <div className="_pagination_info">{`${datas.current_page} of ${datas.last_page} | Total ${datas.total}`}</div>
                  <button
                    className="_pagination_button"
                    disabled={loading || (datas.next_page_url ? false : true)}
                    onClick={() => fetchStudents(datas.next_page_url)}
                  >
                    Next
                  </button>
                </div>
              </div>
              {/* Pagination End */}
            </div>
            {/* Content End */}
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

  const user = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
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

  const students = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/api/student/fetch_students`, {
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
      deleteCookie("user_token", { req, res });
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    });

  return { props: { user, students, cookie } };
}
