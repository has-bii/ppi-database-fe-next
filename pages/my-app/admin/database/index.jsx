import MyNavbar from "@components/MyNavbar";
import SkeletonTable from "@components/SkeletonTable";
import { useToastContext } from "@components/ToastContext";
import UserDashboard from "@components/UserDashboard";
import {
  faArrowDown,
  faArrowUp,
  faFilter,
  faSearch,
  faTableColumns,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import { formatDate } from "@lib/formatDate";
import { getNavbarData } from "@lib/getNavbarData";
import { isAdmin } from "@lib/isRole";

import axios from "axios";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function Index({ user, students, navbarData }) {
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();
  const router = useRouter();
  const cookie = getCookie("user_token");
  const [loading, setLoading] = useState(false);
  const didMounted = useRef(false);
  const didMounted2 = useRef(false);
  const [datas, setDatas] = useState(students);
  const [selected, setSelected] = useState([]);
  const statusRef = useRef();
  const [modal, setModal] = useState({ modal1: false });
  const [cols, setCols] = useState([
    { name: "name", db: "name", show: true },
    { name: "status", db: "status_id", show: true },
    { name: "photo", db: "photo", show: false },
    { name: "obel", db: "ogrenci_belgesi", show: false },
    { name: "ikamet", db: "ikamet_file", show: false },
    { name: "email", db: "email", show: false },
    { name: "kelamin", db: "jenis_kelamin", show: false },
    { name: "whatsapp", db: "whatsapp", show: false },
    { name: "no aktif", db: "no_aktif", show: false },
    { name: "kimlik", db: "tc_kimlik", show: false },
    { name: "kimlik exp", db: "kimlik_exp", show: false },
    { name: "paspor", db: "no_paspor", show: false },
    { name: "paspor exp", db: "paspor_exp", show: false },
    { name: "tanggal lahir", db: "tanggal_lahir", show: false },
    { name: "provinsi", db: "provinsi_indonesia", show: false },
    { name: "asal kota", db: "kota_asal_indonesia", show: false },
    { name: "alamat ID", show: false },
    { name: "kota TR", db: "kota_turki_id", show: true },
    { name: "alamat TR", show: false },
    { name: "kedatangan", db: "tahun_kedatangan", show: true },
    { name: "pendidikan", db: "jenjang_pendidikan", show: false },
    { name: "universitas", db: "universitas_turki_id", show: false },
    { name: "jurusan", show: false },
    { name: "kelas", db: "tahun_ke", show: true },
    { name: "enrolled at", db: "created_at", show: false },
    { name: "updated at", db: "updated_at", show: true },
  ]);
  const [filter, setFilter] = useState({
    limit: "10",
    name: "",
    order_field: "updated_at",
    order_by: "desc",
    status_id: "",
    jenis_kelamin: "",
    kota_turki_id: "",
    jenjang_pendidikan: "",
    universitas_turki_id: "",
    tahun_ke: "",
    tahun_kedatangan: "",
  });

  const [dropdown, setDropdown] = useState({
    dd1: false,
    dd2: false,
  });

  const checkHandler = (e, id) => {
    if (e.target.checked) setSelected((old) => [...old, id]);
    else setSelected(selected.filter((prev) => prev !== id));
  };

  const checkAllHandler = (e) => {
    if (e.target.checked) setSelected(datas.data.map((d) => d.id));
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
    } else setToastFailed("Server-side error occurred!");
  };

  const checkColHandler = (index) => {
    const updated = cols.map((col, i) => {
      if (i === index) {
        col.show = !col.show;

        return col;
      } else {
        return col;
      }
    });

    setCols(updated);
  };

  const searchHandler = (e) => {
    e.preventDefault();

    fetchStudents();
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

  const updateStudentsHandler = async (status_id) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/student/update-students`,
        {
          id: selected.toString(),
          status_id: status_id,
        },
        {
          headers: { Authorization: `Bearer ${cookie}` },
        }
      )
      .then((res) => {
        setToastSuccess("Updated successfully");
        fetchStudents();
      })
      .catch((err) => {
        console.error(err);
        setToastFailed("Server-side error occurred!");
      });
  };

  const openFile = (path) => {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}/${path}`);
  };

  useEffect(() => {
    if (didMounted.current) fetchStudents();
    else didMounted.current = true;
  }, [
    filter.limit,
    filter.order_field,
    filter.order_by,
    filter.jenis_kelamin,
    filter.status_id,
    filter.kota_turki_id,
    filter.jenjang_pendidikan,
    filter.universitas_turki_id,
    filter.tahun_ke,
  ]);

  useEffect(() => {
    if (didMounted2.current) {
      if (
        filter.tahun_kedatangan.length === 0 ||
        filter.tahun_kedatangan.length === 4
      )
        fetchStudents();
    } else didMounted2.current = true;
  }, [filter.tahun_kedatangan]);

  return (
    <>
      {/* Modal change role */}
      <div className={`_modal_container ${modal.modal1 ? "_show" : ""}`}>
        <div className="_modal">
          <div className="_modal_header">
            Change Status User
            <button onClick={() => setModal({ ...modal, modal1: false })}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <div className="_modal_body">
            <label htmlFor="change-status" className="block mb-1">
              Change students status to be
            </label>
            <select
              className="w-full _select_button"
              defaultValue={1}
              ref={statusRef}
              id="change-status"
            >
              <option value="1">Active</option>
              <option value="2">Alumni</option>
              <option value="3">Passive</option>
            </select>
          </div>
          <div className="_modal_buttons">
            <button
              className="_green"
              onClick={() => setModal({ ...modal, modal1: false })}
            >
              Cancel
            </button>
            <button
              className="_yellow"
              onClick={() => {
                setModal({ ...modal, modal1: false });
                updateStudentsHandler(statusRef.current.value);
              }}
            >
              Change
            </button>
          </div>
        </div>
      </div>
      {/* Modal change role end */}

      <div className="min-h-screen bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-full overflow-hidden lg:h-screen _hide_scrollbar lg:flex-row">
          {/* Navbar */}
          <MyNavbar role_id={user.role_id} data={navbarData} />
          {/* Navbar End */}

          <div className="flex flex-col w-full h-full gap-4 p-4 overflow-auto _hide_scrollbar">
            {/* User info */}
            <UserDashboard pageName="Students Database" user={user} />
            {/* User info end */}

            {/* Content */}
            <div className="relative myapp_content">
              {/* Filter container */}
              <div className="_filters_container">
                {/* Search by name */}
                <form
                  onSubmit={searchHandler}
                  className="inline-flex items-center gap-2"
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

                {/* Shown Cols container */}
                <div className="_dropdown_container">
                  <button
                    className="_dropdown_button"
                    onClick={() =>
                      setDropdown({ dd1: !dropdown.dd1, dd2: false })
                    }
                  >
                    <FontAwesomeIcon icon={faTableColumns} />
                    Shown cols
                  </button>
                  <div
                    id="shown-cols"
                    className={`_dropdown_list ${
                      dropdown.dd1 ? "_show" : "_hidden"
                    }`}
                  >
                    <p className="font-semibold">Shown columns:</p>
                    <ul className="grid grid-cols-2 text-gray-500 w-72 gap-x-2 gap-y-1">
                      {cols.map((col, index) => (
                        <li key={index}>
                          <label className="capitalize" htmlFor={index}>
                            {col.name}
                          </label>
                          <input
                            type="checkbox"
                            id={index}
                            checked={col.show}
                            onChange={() => checkColHandler(index)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Shown Cols end */}

                {/* Filters */}
                <div className="_dropdown_container">
                  <button
                    className="_dropdown_button"
                    onClick={() =>
                      setDropdown({ dd1: false, dd2: !dropdown.dd2 })
                    }
                  >
                    <FontAwesomeIcon icon={faFilter} />
                    Filters
                  </button>
                  <div
                    id="shown-cols"
                    className={`_dropdown_list ${
                      dropdown.dd2 ? "_show" : "_hidden"
                    }`}
                  >
                    <p className="font-semibold">Filters :</p>
                    <div className="_filters_dropdown">
                      <div>
                        <label htmlFor="status"> Status </label>
                        <select
                          id="status"
                          value={filter.status_id}
                          onChange={(e) =>
                            setFilter({ ...filter, status_id: e.target.value })
                          }
                        >
                          <option value="">All</option>
                          <option value="1">Active</option>
                          <option value="2">Alumni</option>
                          <option value="3">Passive</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="kelamin"> Kelamin </label>
                        <select
                          id="kelamin"
                          value={filter.jenis_kelamin}
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              jenis_kelamin: e.target.value,
                            })
                          }
                        >
                          <option value="">All</option>
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="kota-turki">Kota Turki</label>
                        <select
                          id="kota-turki"
                          value={filter.kota_turki_id}
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              kota_turki_id: e.target.value,
                            })
                          }
                        >
                          <option value="">All</option>
                          <option value="1">Bartın</option>
                          <option value="2">Karabük</option>
                          <option value="3">Zonguldak</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="pendidikan">Pendidikan</label>
                        <select
                          id="pendidikan"
                          value={filter.jenjang_pendidikan}
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              jenjang_pendidikan: e.target.value,
                            })
                          }
                        >
                          <option value="">All</option>
                          <option value="Lise">Lise</option>
                          <option value="S1">S1</option>
                          <option value="S2">S2</option>
                          <option value="S3">S3</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="universitas">Universitas</label>
                        <select
                          id="universitas"
                          value={filter.universitas_turki_id}
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              universitas_turki_id: e.target.value,
                            })
                          }
                        >
                          <option value="">All</option>
                          <option value="1">Bartın Üniversitesi</option>
                          <option value="2">Karabük Üniversitesi</option>
                          <option value="3">
                            Zonguldak Bülent Ecevit Üniversitesi
                          </option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="tahun-ke">Kelas</label>
                        <select
                          id="tahun-ke"
                          value={filter.tahun_ke}
                          onChange={(e) =>
                            setFilter({ ...filter, tahun_ke: e.target.value })
                          }
                        >
                          <option value="">All</option>
                          <option value="TÖMER">TÖMER</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="kedatangan">Kedatangan</label>
                        <input
                          type="number"
                          id="kedatangan"
                          placeholder="Tahun kedatangan"
                          value={filter.tahun_kedatangan}
                          onChange={(e) =>
                            setFilter({
                              ...filter,
                              tahun_kedatangan: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Filters end */}

                {/* Number of rows */}
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
                {/* Number of rows End */}

                {/* Selected */}
                <div className="_selected_container">
                  <div className="_selected_action">
                    <button
                      className="_green"
                      disabled={selected.length === 0}
                      onClick={() => setModal({ ...modal, modal1: true })}
                    >
                      Change status
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
                        {cols.map(
                          (col, index) =>
                            col.show && (
                              <th key={index}>
                                <button
                                  className="_row_table"
                                  onClick={() => orderHandler(col.db)}
                                >
                                  {col.name}
                                  {filter.order_field === col.db && (
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
                            )
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
                          {cols.map(
                            (col, index) =>
                              col.show && (
                                <td
                                  key={index}
                                  className={
                                    col.name === "alamat ID" ||
                                    col.name === "alamat TR"
                                      ? "_wider_col"
                                      : ""
                                  }
                                >
                                  {col.name === "name" && data.name}
                                  {col.name === "status" && (
                                    <span
                                      className={`_pill ${
                                        data.status_id === 1
                                          ? "_success"
                                          : data.status_id === 2
                                          ? "_sky"
                                          : "_error"
                                      }`}
                                    >
                                      {data.status.name}
                                    </span>
                                  )}
                                  {col.name === "photo" &&
                                    (data.photo ? (
                                      <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/${data.photo}`}
                                        width={100}
                                        height={100}
                                        className="border border-black hover:scale-150"
                                        alt="pas photo"
                                      />
                                    ) : (
                                      ""
                                    ))}
                                  {col.name === "obel" &&
                                    (data.ogrenci_belgesi ? (
                                      <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL}/${data.ogrenci_belgesi}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 rounded-lg _gray"
                                      >
                                        Open
                                      </a>
                                    ) : (
                                      ""
                                    ))}
                                  {col.name === "ikamet" &&
                                    (data.ikamet_file ? (
                                      <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL}/${data.ikamet_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 rounded-lg _gray"
                                      >
                                        Open
                                      </a>
                                    ) : (
                                      ""
                                    ))}
                                  {col.name === "email" && data.email}
                                  {col.name === "kelamin" && data.jenis_kelamin}
                                  {col.name === "whatsapp" && data.whatsapp}
                                  {col.name === "no aktif" && data.no_aktif}
                                  {col.name === "kimlik" && data.tc_kimlik}
                                  {col.name === "kimlik exp" && data.kimlik_exp}
                                  {col.name === "paspor" && data.no_paspor}
                                  {col.name === "paspor exp" && data.paspor_exp}
                                  {col.name === "tanggal lahir" &&
                                    data.tanggal_lahir}
                                  {col.name === "provinsi" &&
                                    data.provinsi_indonesia}
                                  {col.name === "asal kota" &&
                                    data.kota_asal_indonesia}
                                  {col.name === "alamat ID" &&
                                    data.alamat_lengkap_indonesia}
                                  {col.name === "kota TR" &&
                                    data.kota_turki?.name}
                                  {col.name === "alamat TR" &&
                                    data.alamat_turki}
                                  {col.name === "kedatangan" &&
                                    data.tahun_kedatangan}
                                  {col.name === "universitas" &&
                                    data.universitas_turki?.name}
                                  {col.name === "jurusan" && data.jurusan?.name}
                                  {col.name === "pendidikan" &&
                                    data.jenjang_pendidikan}
                                  {col.name === "kelas" && data.tahun_ke}
                                  {col.name === "enrolled at" &&
                                    formatDate(data.created_at)}
                                  {col.name === "updated at" &&
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

  const params = {
    limit: 10,
    order_field: "updated_at",
    order_by: "desc",
  };

  const students = await fetchData("/student/fetch_students", req, res, params);

  if (!students)
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };

  const navbarData = await getNavbarData({ req, res });

  return { props: { user, students, navbarData } };
}
