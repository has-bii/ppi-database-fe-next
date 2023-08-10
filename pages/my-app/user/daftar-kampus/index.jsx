import MyNavbar from "@components/MyNavbar";
import UserDashboard from "@components/UserDashboard";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import { getNavbarData } from "@lib/getNavbarData";
import { hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Index({
  user,
  navbarData,
  userInfo,
  apps,
  userAppDatas,
}) {
  const router = useRouter();
  const openLink = (link) => {
    window.open(process.env.NEXT_PUBLIC_API_URL + "/" + link, "_blank");
  };

  return (
    <>
      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-full lg:flex-row">
          <MyNavbar role_id={user.role_id} data={navbarData} />
          <div className="flex flex-col w-full gap-4 p-4">
            {/* User info */}
            <UserDashboard pageName="Daftar Kuliah" user={user} />

            {/* Contents */}
            <div className="myapp_content">
              {/* Apps */}
              <div className="overflow-hidden border divide-y rounded-md border-slate-300 divide-slate-300">
                <h3 className="px-4 py-2 text-lg font-semibold capitalize bg-slate-100">
                  Pendaftaran
                </h3>
                <div className="flex flex-col gap-2 divide-y divide-slate-300">
                  {userInfo ? (
                    apps ? (
                      apps.map(
                        (app) =>
                          app.active == 1 && (
                            <div
                              key={app.id}
                              className="inline-flex items-center justify-between w-full px-6 py-3"
                            >
                              <div>
                                <h2 className="text-lg font-semibold text-black">
                                  {app.name}
                                </h2>
                                <p className="text-sm text-slate-400">
                                  {app.desc}
                                </p>
                              </div>
                              <button
                                className={
                                  "px-3 py-1.5 h-fit disabled:_gray rounded-md _" +
                                  app.app_status.style
                                }
                                disabled={app.app_status_id !== 1}
                                onClick={() =>
                                  router.push(
                                    "/my-app/user/daftar-kampus/" + app.id
                                  )
                                }
                              >
                                {app.app_status.name}
                              </button>
                            </div>
                          )
                      )
                    ) : (
                      <div className="w-full px-4 py-2 text-yellow-400 bg-yellow-100 border border-yellow-300 rounded">
                        Tidak ada pendaftaran yang tersedia.
                      </div>
                    )
                  ) : (
                    <div className="w-full px-4 py-2 text-red-400 bg-red-100 border border-red-300 rounded">
                      Biodata belum diisi, silahkan isi biodata terlebih dahulu.{" "}
                      <Link
                        href="/my-app/user/biodata"
                        className="text-blue-400"
                      >
                        Klik di sini.
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {userInfo !== null && (
                <div className="overflow-hidden border divide-y rounded-md border-slate-300 divide-slate-300">
                  <h3 className="px-4 py-2 text-lg font-semibold capitalize bg-slate-100">
                    My Applications
                  </h3>
                  <div className="flex flex-col gap-2 divide-y divide-slate-300">
                    {userAppDatas ? (
                      userAppDatas.map((userApp) => (
                        <div
                          key={userApp.id}
                          className="inline-flex items-center justify-between w-full px-6 py-3"
                        >
                          <div>
                            <h2 className="text-lg font-semibold text-black">
                              {userApp?.application?.name}
                            </h2>
                            <span
                              className={
                                "px-2 py-1 rounded-lg text-sm _" +
                                userApp?.app_status?.style
                              }
                            >
                              {userApp?.app_status?.name}
                            </span>
                          </div>
                          <button
                            className="px-3 py-1.5 bg-black rounded-lg text-white"
                            onClick={() =>
                              router.push(
                                "/my-app/user/daftar-kampus/" +
                                  userApp?.application_id
                              )
                            }
                          >
                            Open
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="w-full px-4 py-2 text-yellow-400 bg-yellow-100 border border-yellow-300 rounded">
                        Tidak ada pendaftaran yang tersedia.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Apps end */}
              <div className="w-full overflow-hidden border divide-y rounded-md border-slate-300 divide-slate-300">
                <h3 className="px-4 py-2 text-lg font-semibold capitalize bg-slate-100">
                  Data diri
                </h3>
                <table className="w-full table-fixed biodata">
                  <tbody>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td className="lg:w-1/5">Nama depan</td>
                      <td>{userInfo ? userInfo.nama_depan : "-"}</td>
                    </tr>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td>Nama belakang</td>
                      <td>{userInfo ? userInfo.nama_belakang : "-"}</td>
                    </tr>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td>Nama bapak</td>
                      <td>{userInfo ? userInfo.nama_bapak : "-"}</td>
                    </tr>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td>Nama ibu</td>
                      <td>{userInfo ? userInfo.nama_ibu : "-"}</td>
                    </tr>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td>kelamin</td>
                      <td>{userInfo ? userInfo.kelamin : "-"}</td>
                    </tr>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td>Tempat tanggal lahir</td>
                      <td>{userInfo ? userInfo.ttl : "-"}</td>
                    </tr>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td>No Paspor</td>
                      <td>{userInfo ? userInfo.no_paspor : "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-hidden border divide-y rounded-md border-slate-300 divide-slate-300">
                <h3 className="px-4 py-2 text-lg font-semibold capitalize bg-slate-100">
                  Kontak
                </h3>
                <table className="w-full table-fixed biodata">
                  <tbody>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td className="lg:w-1/5">Provinsi</td>
                      <td>{userInfo ? userInfo.provinsi : "-"}</td>
                    </tr>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td>kota</td>
                      <td>{userInfo ? userInfo.kota : "-"}</td>
                    </tr>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td>alamat</td>
                      <td>{userInfo ? userInfo.alamat : "-"}</td>
                    </tr>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td>email</td>
                      <td>{userInfo ? userInfo.email : "-"}</td>
                    </tr>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td>No Handphone</td>
                      <td>{userInfo ? userInfo.no_hp : "-"}</td>
                    </tr>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td>No Handphone 2</td>
                      <td>{userInfo ? userInfo.no_hp_lain : "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-hidden border divide-y rounded-md border-slate-300 divide-slate-300">
                <h3 className="px-4 py-2 text-lg font-semibold capitalize bg-slate-100">
                  Data Sekolah
                </h3>
                <table className="w-full table-fixed biodata">
                  <tbody>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td className="lg:w-1/5">Nama sekolah</td>
                      <td>{userInfo ? userInfo.nama_sekolah : "-"}</td>
                    </tr>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td>Kota sekolah</td>
                      <td>{userInfo ? userInfo.kota_sekolah : "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-hidden border divide-y rounded-md border-slate-300 divide-slate-300">
                <h3 className="px-4 py-2 text-lg font-semibold capitalize bg-slate-100">
                  Dokumen-dokumen
                </h3>
                <table className="w-full table-fixed biodata">
                  <tbody>
                    <tr className="capitalize divide-x divide-slate-300">
                      <td className="lg:w-1/5">Pas Foto</td>
                      <td>
                        {userInfo ? (
                          <button
                            type="button"
                            className="px-3 py-1.5 bg-black text-white rounded-md"
                            onClick={() => openLink(userInfo.pas_photo)}
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
                        {userInfo ? (
                          <button
                            type="button"
                            className="px-3 py-1.5 bg-black text-white rounded-md"
                            onClick={() => openLink(userInfo.ijazah)}
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
                        {userInfo ? (
                          <button
                            type="button"
                            className="px-3 py-1.5 bg-black text-white rounded-md"
                            onClick={() => openLink(userInfo.transkrip)}
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
                        {userInfo ? (
                          <button
                            type="button"
                            className="px-3 py-1.5 bg-black text-white rounded-md"
                            onClick={() => openLink(userInfo.paspor)}
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
                        {userInfo ? (
                          <button
                            type="button"
                            className="px-3 py-1.5 bg-black text-white rounded-md"
                            onClick={() => openLink(userInfo.surat_rekomendasi)}
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
                        {userInfo ? (
                          <button
                            type="button"
                            className="px-3 py-1.5 bg-black text-white rounded-md"
                            onClick={() => openLink(userInfo.surat_izin)}
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

  const userInfo = await fetchData("/user-info", req, res, {
    user_id: user.id,
  });

  const application = await fetchData("/application", req, res);

  const { apps } = application;

  const userAppDatas = await fetchData("/user-app", req, res, {
    user_id: user.id,
  });

  return { props: { user, navbarData, userInfo, apps, userAppDatas } };
}
