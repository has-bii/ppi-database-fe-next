import Modal from "@components/Modal";
import MyNavbar from "@components/MyNavbar";
import { useToastContext } from "@components/ToastContext";
import UserDashboard from "@components/UserDashboard";
import { fetchData } from "@lib/fetchData";
import { fetchDataClient } from "@lib/fetchDataClient";
import { fetchUser } from "@lib/fetchUser";
import { formatDate } from "@lib/formatDate";
import { getNavbarData } from "@lib/getNavbarData";
import { isPPMB } from "@lib/isRole";
import LOGO_HIGH from "@public/image/logo-high.png";
import LOGO_KBU from "@public/image/logo-kbu.png";
import axios from "axios";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import jsPDF from "jspdf";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Index({ user, navbarData, userApps }) {
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userAppData, setUserAppData] = useState(userApps.user_apps);
  const pdfRef = useRef();

  const [selected, setSelected] = useState({});

  const openLink = (link) => {
    window.open(process.env.NEXT_PUBLIC_API_URL + "/" + link, "_blank");
  };

  const fetchData = async (id) => {
    const res = await fetchDataClient("/user-app", { id: id });

    if (res) {
      setSelected(res);
      setModal(true);
    }
  };

  const fetchUserApp = async (url) => {
    const cookie = getCookie("user_token");
    setLoading(true);

    const data = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
        params: { limit: 10 },
      })
      .then((res) => {
        setUserAppData(res.data.result.user_apps);
        setLoading(false);
      })
      .catch((err) => {
        return null;
      });
  };

  return (
    <>
      {/* Biodata Modal */}
      <Modal title="Biodata" show={modal} setShow={setModal}>
        <div className="flex flex-col gap-4 p-4 pdf" ref={pdfRef}>
          {/* Apps end */}
          <div className="w-full overflow-hidden border divide-y rounded-md border-slate-300 divide-slate-300">
            <h3 className="px-4 py-2 text-lg font-semibold capitalize bg-slate-100">
              Data diri
            </h3>
            <table className="table-auto biodata">
              <tbody>
                <tr className="capitalize divide-x divide-slate-300">
                  <td className="lg:w-1/5">Nama depan</td>
                  <td>
                    {selected ? selected?.user?.user_info?.nama_depan : "-"}
                  </td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>Nama belakang</td>
                  <td>
                    {selected ? selected?.user?.user_info?.nama_belakang : "-"}
                  </td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>Nama bapak</td>
                  <td>
                    {selected ? selected?.user?.user_info?.nama_bapak : "-"}
                  </td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>Nama ibu</td>
                  <td>
                    {selected ? selected?.user?.user_info?.nama_ibu : "-"}
                  </td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>kelamin</td>
                  <td>{selected ? selected?.user?.user_info?.kelamin : "-"}</td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>Tempat tanggal lahir</td>
                  <td>{selected ? selected?.user?.user_info?.ttl : "-"}</td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>No Paspor</td>
                  <td>
                    {selected ? selected?.user?.user_info?.no_paspor : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="overflow-hidden border divide-y rounded-md border-slate-300 divide-slate-300">
            <h3 className="px-4 py-2 text-lg font-semibold capitalize bg-slate-100">
              Kontak
            </h3>
            <table className="table-auto biodata">
              <tbody>
                <tr className="capitalize divide-x divide-slate-300">
                  <td className="lg:w-1/5">Provinsi</td>
                  <td>
                    {selected ? selected?.user?.user_info?.provinsi : "-"}
                  </td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>kota</td>
                  <td>{selected ? selected?.user?.user_info?.kota : "-"}</td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>alamat</td>
                  <td>{selected ? selected?.user?.user_info?.alamat : "-"}</td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>email</td>
                  <td>{selected ? selected?.user?.user_info?.email : "-"}</td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>No Handphone</td>
                  <td>{selected ? selected?.user?.user_info?.no_hp : "-"}</td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>No Handphone 2</td>
                  <td>
                    {selected ? selected?.user?.user_info?.no_hp_lain : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="overflow-hidden border divide-y rounded-md border-slate-300 divide-slate-300">
            <h3 className="px-4 py-2 text-lg font-semibold capitalize bg-slate-100">
              Data Sekolah
            </h3>
            <table className="table-auto biodata">
              <tbody>
                <tr className="capitalize divide-x divide-slate-300">
                  <td className="lg:w-1/5">Nama sekolah</td>
                  <td>
                    {selected ? selected?.user?.user_info?.nama_sekolah : "-"}
                  </td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>Kota sekolah</td>
                  <td>
                    {selected ? selected?.user?.user_info?.kota_sekolah : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="overflow-hidden border divide-y rounded-md border-slate-300 divide-slate-300">
            <h3 className="px-4 py-2 text-lg font-semibold capitalize bg-slate-100">
              Dokumen-dokumen
            </h3>
            <table className="table-auto biodata">
              <tbody>
                <tr className="capitalize divide-x divide-slate-300">
                  <td className="lg:w-1/5">Pas Foto</td>
                  <td>
                    {selected ? (
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-black text-white rounded-md"
                        onClick={() =>
                          openLink(selected?.user?.user_info?.pas_photo)
                        }
                      >
                        Open
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>Ijazah</td>
                  <td>
                    {selected ? (
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-black text-white rounded-md"
                        onClick={() =>
                          openLink(selected?.user?.user_info?.ijazah)
                        }
                      >
                        Open
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>transkrip</td>
                  <td>
                    {selected ? (
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-black text-white rounded-md"
                        onClick={() =>
                          openLink(selected?.user?.user_info?.transkrip)
                        }
                      >
                        Open
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>paspor</td>
                  <td>
                    {selected ? (
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-black text-white rounded-md"
                        onClick={() =>
                          openLink(selected?.user?.user_info?.paspor)
                        }
                      >
                        Open
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>surat rekomendasi</td>
                  <td>
                    {selected ? (
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-black text-white rounded-md"
                        onClick={() =>
                          openLink(selected?.user?.user_info?.surat_rekomendasi)
                        }
                      >
                        Open
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
                <tr className="capitalize divide-x divide-slate-300">
                  <td>surat izin</td>
                  <td>
                    {selected ? (
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-black text-white rounded-md"
                        onClick={() =>
                          openLink(selected?.user?.user_info?.surat_izin)
                        }
                      >
                        Open
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
      {/* Biodata Model end */}
      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-screen lg:h-full lg:flex-row">
          <MyNavbar role_id={user.role_id} data={navbarData} />
          <div className="flex flex-col w-full gap-4 p-4">
            {/* User info */}
            <UserDashboard pageName="Pendaftaran" user={user} />

            {/* Contents */}
            <div className="h-full myapp_content">
              <h2 className="text-lg font-semibold text-black">
                {userApps?.application?.name}
              </h2>
              <div className="_table_container">
                <table className="table-auto">
                  <thead>
                    <tr>
                      {/* THead */}
                      {userApps?.user_apps_row?.map(
                        (row, i) =>
                          row !== "application_id" && (
                            <th key={i} scope="col">
                              {row.replace(/(?:_id|_)/g, " ")}
                            </th>
                          )
                      )}
                      <th scope="col">Action</th>
                      {/* THead end */}
                    </tr>
                  </thead>
                  <tbody>
                    {userAppData?.total === 0 ? (
                      <tr>
                        <td
                          colSpan={userApps.user_apps_row.length}
                          className="text-center"
                        >
                          There are no applications
                        </td>
                      </tr>
                    ) : (
                      userAppData?.data?.map((user_app, i) => (
                        <tr key={i}>
                          <td>{user_app?.user?.name}</td>
                          <td>
                            <span
                              className={
                                "status " + user_app?.app_status?.style
                              }
                            >
                              {user_app?.app_status?.name}
                            </span>
                          </td>
                          <td>{user_app?.education?.name}</td>
                          <td>{user_app?.nilai_ujian}</td>
                          <td className="whitespace-normal">
                            {user_app?.jurusan_1}
                          </td>
                          <td className="whitespace-normal">
                            {user_app?.jurusan_2}
                          </td>
                          <td className="whitespace-normal">
                            {user_app?.jurusan_3}
                          </td>
                          <td>
                            <button
                              className="px-2 py-1 text-sm text-white bg-black rounded-md"
                              onClick={() => openLink(user_app?.receipt)}
                            >
                              view
                            </button>
                          </td>
                          <td>{formatDate(user_app.updated_at)}</td>
                          <td>
                            <button
                              className="px-2 py-1 rounded-md _green"
                              onClick={() => fetchData(user_app.id)}
                            >
                              Biodata
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="_pagination_container">
                <div className="_pagination">
                  <button
                    className="_pagination_button"
                    disabled={
                      loading || (userAppData.prev_page_url ? false : true)
                    }
                    onClick={() => fetchUserApp(userAppData.prev_page_url)}
                  >
                    Prev
                  </button>
                  <div className="_pagination_info">{`${userAppData.current_page} of ${userAppData.last_page} | Total ${userAppData.total}`}</div>
                  <button
                    className="_pagination_button"
                    disabled={
                      loading || (userAppData.next_page_url ? false : true)
                    }
                    onClick={() => fetchUserApp(userAppData.next_page_url)}
                  >
                    Next
                  </button>
                </div>
              </div>
              {/* Pagination End */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res, resolvedUrl, params }) {
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

  const navbarData = await getNavbarData({ req, res });

  const userApps = await fetchData("/user-app", req, res, {
    application_id: params.id,
    limit: 10,
  });

  if (!userApps)
    return {
      redirect: {
        destination: "/my-app/PPMB/application",
        permanent: false,
      },
    };

  if (!userApps.application)
    return {
      redirect: {
        destination: "/my-app/PPMB/application",
        permanent: false,
      },
    };

  return { props: { user, navbarData, userApps } };
}
