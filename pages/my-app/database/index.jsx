import MyNavbar from "@components/MyNavbar";
import SkeletonTable from "@components/SkeletonTable";
import UserDashboard from "@components/UserDashboard";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from "@lib/formatDate";
import axios from "axios";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function index({ user, students }) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([
    "name",
    "kelamin",
    "whatsapp",
    "no aktif",
    "kimlik",
    "kimlik exp",
    "paspor",
    "paspor exp",
    "tanggal lahir",
    "provinsi",
    "asal kota",
    "alamat ID",
    "kota TR",
    "alamat TR",
    "kedatangan",
    "universitas",
    "jurusan",
    "pendidikan",
    "kelas",
    "enrolled at",
    "updated at",
  ]);

  const checkHandler = (e, id) => {
    if (e.target.checked) setSelected((old) => [...old, id]);
    else setSelected(selected.filter((prev) => prev !== id));
  };

  const checkAllHandler = (e) => {
    if (e.target.checked) setSelected(students.data.map((d) => d.id));
    else setSelected([]);
  };

  return (
    <>
      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-screen overflow-hidden _hide_scrollbar lg:flex-row">
          {/* Navbar */}
          <MyNavbar role_id={user.role_id} />
          {/* Navbar End */}

          <div className="flex flex-col w-full gap-4 p-4 overflow-hidden">
            {/* User info */}
            <UserDashboard pageName="Students Database" user={user} />
            {/* User info end */}

            {/* Content */}
            <div className="flex flex-col w-full h-full gap-4 p-6 bg-white rounded-xl">
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
                        {rows.map((r, i) => (
                          <th key={i} scope="col">
                            {r}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.data.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selected.includes(student.id)}
                              onChange={(e) => checkHandler(e, student.id)}
                            />
                          </td>
                          {rows.includes("name") && <td>{student.name}</td>}
                          {rows.includes("kelamin") && (
                            <td>{student.jenis_kelamin}</td>
                          )}
                          {rows.includes("whatsapp") && (
                            <td>{student.whatsapp}</td>
                          )}
                          {rows.includes("no aktif") && (
                            <td>{student.no_aktif}</td>
                          )}
                          {rows.includes("kimlik") && (
                            <td>{student.tc_kimlik}</td>
                          )}
                          {rows.includes("kimlik exp") && (
                            <td>{student.kimlik_exp}</td>
                          )}
                          {rows.includes("paspor") && (
                            <td>{student.no_paspor}</td>
                          )}
                          {rows.includes("paspor exp") && (
                            <td>{student.paspor_exp}</td>
                          )}
                          {rows.includes("tanggal lahir") && (
                            <td>{student.tanggal_lahir}</td>
                          )}
                          {rows.includes("provinsi") && (
                            <td>{student.provinsi_indonesia}</td>
                          )}
                          {rows.includes("asal kota") && (
                            <td>{student.kota_asal_indonesia}</td>
                          )}
                          {rows.includes("alamat ID") && (
                            <td className="_wider_col">
                              {student.alamat_lengkap_indonesia}
                            </td>
                          )}
                          {rows.includes("kota TR") && (
                            <td>{student.kota_turki.name}</td>
                          )}
                          {rows.includes("alamat TR") && (
                            <td className="_wider_col">
                              {student.alamat_turki}
                            </td>
                          )}
                          {rows.includes("kedatangan") && (
                            <td>{student.tahun_kedatangan}</td>
                          )}
                          {rows.includes("universitas") && (
                            <td>{student.universitas_turki.name}</td>
                          )}
                          {rows.includes("jurusan") && (
                            <td>{student.jurusan.name}</td>
                          )}
                          {rows.includes("pendidikan") && (
                            <td>{student.jenjang_pendidikan}</td>
                          )}
                          {rows.includes("kelas") && (
                            <td>{student.tahun_ke}</td>
                          )}
                          {rows.includes("enrolled at") && (
                            <td>{formatDate(student.created_at)}</td>
                          )}
                          {rows.includes("updated at") && (
                            <td>{formatDate(student.updated_at)}</td>
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
                <div className="_pagination_info">
                  {loading
                    ? "Loading data..."
                    : `Page ${students.current_page} of ${students.last_page} | Total ${students.total}`}
                </div>
                <div className="_pagination">
                  <button
                    className="_pagination_button"
                    disabled={
                      loading || (students.prev_page_url ? false : true)
                    }
                  >
                    Prev
                  </button>
                  <div>
                    {students.links
                      .slice(1, students.links.length - 1)
                      .map((l, i) => (
                        <button key={i} className="_pagination_button">
                          {l.label}
                        </button>
                      ))}
                  </div>
                  <button
                    className="_pagination_button"
                    disabled={
                      loading || (students.page_page_url ? false : true)
                    }
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

  return { props: { user, students } };
}
