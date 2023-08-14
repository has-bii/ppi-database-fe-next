import MyNavbar from "@components/MyNavbar";
import SkeletonPage from "@components/SkeletonPage";
import { useToastContext } from "@components/ToastContext";
import UserDashboard from "@components/UserDashboard";
import { fetchDataClient } from "@lib/fetchDataClient";
import { fetchUser } from "@lib/fetchUser";
import { getNavbarData } from "@lib/getNavbarData";
import { sendData } from "@lib/sendData";
import { hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

const maxFileSize = 1024 * 1024 * process.env.NEXT_PUBLIC_MAX_FILE_SIZE;

export default function Index({ user, navbarData }) {
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [firstMount, setFirstMount] = useState(true);
  const [data, setData] = useState({
    nama_depan: "",
    nama_belakang: "",
    nama_bapak: "",
    nama_ibu: "",
    kelamin: "",
    ttl: "",
    no_paspor: "",
    provinsi: "",
    kota: "",
    alamat: "",
    email: "",
    no_hp: "",
    no_hp_lain: "",
    nama_sekolah: "",
    kota_sekolah: "",
    pas_photo: "",
    ijazah: "",
    transkrip: "",
    paspor: "",
    surat_rekomendasi: "",
    surat_izin: "",
  });
  const [files, setFiles] = useState({
    pas_photo: null,
    ijazah: null,
    transkrip: null,
    paspor: null,
    surat_rekomendasi: null,
    surat_izin: null,
  });

  const uploadFileHandler = (e, property, type) => {
    if (e.target.files[0]) {
      if (e.target.files[0].size > maxFileSize) {
        alert(
          `File size exceeds maximum limit ${process.env.NEXT_PUBLIC_MAX_FILE_SIZE} MB`
        );
        e.target.value = "";
      } else if (!e.target.files[0].type.startsWith(type)) {
        alert("File type does not support!");
        e.target.value = "";
      } else setFiles({ ...files, [property]: e.target.files[0] });
    } else {
      setFiles({ ...files, [property]: null });
      e.target.value = "";
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    let url;

    if (update) url = "/user-info/update";
    else url = "/user-info/create";

    const formData = new FormData();

    formData.append("nama_depan", data.nama_depan);
    formData.append("nama_belakang", data.nama_belakang);
    formData.append("nama_bapak", data.nama_bapak);
    formData.append("nama_ibu", data.nama_ibu);
    formData.append("kelamin", data.kelamin);
    formData.append("ttl", data.ttl);
    formData.append("no_paspor", data.no_paspor);
    formData.append("provinsi", data.provinsi);
    formData.append("kota", data.kota);
    formData.append("alamat", data.alamat);
    formData.append("email", data.email);
    formData.append("no_hp", data.no_hp);
    formData.append("no_hp_lain", data.no_hp_lain);
    formData.append("nama_sekolah", data.nama_sekolah);
    formData.append("kota_sekolah", data.kota_sekolah);

    if (files.pas_photo) formData.append("pas_photo", files.pas_photo);
    if (files.ijazah) formData.append("ijazah", files.ijazah);
    if (files.transkrip) formData.append("transkrip", files.transkrip);
    if (files.paspor) formData.append("paspor", files.paspor);
    if (files.surat_rekomendasi)
      formData.append("surat_rekomendasi", files.surat_rekomendasi);
    if (files.surat_izin) formData.append("surat_izin", files.surat_izin);

    const res = await sendData(url, formData);
    setToastLoading("Saving data...");

    if (res) {
      setToastSuccess("Saved successfully");
      fetchUserInfo();
    } else setToastFailed("Failed to save!");

    setLoading(false);
  };

  const openLink = (link) => {
    window.open(process.env.NEXT_PUBLIC_API_URL + "/" + link, "_blank");
  };

  const fetchUserInfo = async () => {
    const res = await fetchDataClient("/user-info", { user_id: user.id });

    if (res) {
      if (res?.no_hp_lain === null) res.no_hp_lain = "";

      setData(res);
      setUpdate(true);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const res = await fetchDataClient("/user-info", { user_id: user.id });

      if (res) {
        if (res?.no_hp_lain === null) res.no_hp_lain = "";

        setData(res);
        setUpdate(true);
      }

      setFirstMount(false);
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-full min-h-screen lg:flex-row">
          <MyNavbar role_id={user.role_id} data={navbarData} />
          <div className="flex flex-col w-full gap-4 p-4">
            {/* User info */}
            <UserDashboard pageName="Biodata" user={user} />

            {/* Contents */}
            <div className="h-full myapp_content">
              {firstMount ? (
                <SkeletonPage />
              ) : (
                <form
                  onSubmit={submitHandler}
                  className="flex flex-col w-full gap-2"
                >
                  <h3 className="text-lg font-semibold capitalize">
                    Data diri
                  </h3>
                  <div className="flex flex-col gap-4 p-6 mb-4 lg:gap-12 lg:flex-row form">
                    <div className="flex flex-col w-full gap-4">
                      <div>
                        <label htmlFor="nama_depan">Nama depan</label>
                        <input
                          type="text"
                          name="nama_depan"
                          placeholder="Nama depan"
                          required
                          value={data.nama_depan}
                          onChange={(e) =>
                            setData({ ...data, nama_depan: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="nama_belakang">Nama belakang</label>
                        <input
                          type="text"
                          name="nama_belakang"
                          placeholder="Nama belakang"
                          required
                          value={data.nama_belakang}
                          onChange={(e) =>
                            setData({ ...data, nama_belakang: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="nama_bapak">Nama bapak</label>
                        <input
                          type="text"
                          name="nama_bapak"
                          placeholder="Nama bapak"
                          required
                          value={data.nama_bapak}
                          onChange={(e) =>
                            setData({ ...data, nama_bapak: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="nama_ibu">Nama ibu</label>
                        <input
                          type="text"
                          name="nama_ibu"
                          placeholder="Nama ibu"
                          required
                          value={data.nama_ibu}
                          onChange={(e) =>
                            setData({ ...data, nama_ibu: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-full gap-4">
                      <div>
                        <label htmlFor="kelamin">Kelamin</label>
                        <select
                          type="text"
                          name="kelamin"
                          required
                          value={data.kelamin}
                          onChange={(e) =>
                            setData({ ...data, kelamin: e.target.value })
                          }
                        >
                          <option value="">Pilih jenis kelamin</option>
                          <option value="laki-laki">Laki-laki</option>
                          <option value="perempuan">Perempuan</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="ttl">Tempat tanggal lahir</label>
                        <input
                          type="text"
                          name="ttl"
                          placeholder="Jakarta, 25 Mei 2000"
                          required
                          value={data.ttl}
                          onChange={(e) =>
                            setData({ ...data, ttl: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="no_paspor">Paspor</label>
                        <input
                          type="text"
                          name="no_paspor"
                          placeholder="Nomor paspor"
                          required
                          value={data.no_paspor}
                          onChange={(e) =>
                            setData({ ...data, no_paspor: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold capitalize">Kontak</h3>
                  <div className="flex flex-col gap-4 p-6 mb-4 lg:gap-12 lg:flex-row form">
                    <div className="flex flex-col w-full gap-4">
                      <div>
                        <label htmlFor="provinsi">Provinsi</label>
                        <input
                          type="text"
                          name="provinsi"
                          placeholder="Asal provinsi"
                          required
                          value={data.provinsi}
                          onChange={(e) =>
                            setData({ ...data, provinsi: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="kota">kota</label>
                        <input
                          type="text"
                          name="kota"
                          placeholder="Asal kota"
                          required
                          value={data.kota}
                          onChange={(e) =>
                            setData({ ...data, kota: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="alamat">alamat</label>
                        <textarea
                          name="alamat"
                          placeholder="Alamat lengkap"
                          rows="3"
                          required
                          value={data.alamat}
                          onChange={(e) =>
                            setData({ ...data, alamat: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-full gap-4">
                      <div>
                        <label htmlFor="email">email</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Alamat email"
                          required
                          value={data.email}
                          onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="no_hp">No handphone</label>
                        <input
                          type="text"
                          name="no_hp"
                          placeholder="Dengan kode negara +62"
                          required
                          value={data.no_hp}
                          onChange={(e) =>
                            setData({ ...data, no_hp: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="no_hp_lain">No handphone 2</label>
                        <input
                          type="text"
                          name="no_hp"
                          placeholder="Dengan kode negara +90"
                          value={data.no_hp_lain}
                          onChange={(e) =>
                            setData({ ...data, no_hp_lain: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold capitalize">
                    Data Sekolah
                  </h3>
                  <div className="flex flex-col gap-4 p-6 mb-4 lg:gap-12 lg:flex-row form">
                    <div className="flex flex-col w-full gap-4">
                      <div>
                        <label htmlFor="nama_sekolah">Nama sekolah</label>
                        <input
                          type="text"
                          name="nama_sekolah"
                          placeholder="Asal nama sekolah"
                          required
                          value={data.nama_sekolah}
                          onChange={(e) =>
                            setData({ ...data, nama_sekolah: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-full gap-4">
                      <div>
                        <label htmlFor="kota_sekolah">kota sekolah</label>
                        <input
                          type="text"
                          name="kota_sekolah"
                          placeholder="Asal kota sekolah"
                          required
                          value={data.kota_sekolah}
                          onChange={(e) =>
                            setData({ ...data, kota_sekolah: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold capitalize">
                    Dokumen-dokumen
                  </h3>
                  <div className="flex flex-col gap-4 p-6 mb-4 lg:gap-12 lg:flex-row form">
                    <div className="flex flex-col w-full gap-4">
                      <div>
                        <label htmlFor="pas_photo">Pas Foto</label>
                        {data.pas_photo ? (
                          <div className="inline-flex items-end gap-2">
                            <Image
                              src={
                                process.env.NEXT_PUBLIC_API_URL +
                                "/" +
                                data.pas_photo
                              }
                              height={200}
                              width={150}
                              alt=""
                              className="border-2 rounded-md border-slate-300"
                            />
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() =>
                                setData({ ...data, pas_photo: "" })
                              }
                            >
                              remove
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            className="file-input"
                            id="pas_photo"
                            accept="image/jpg,image/png,image/jpeg"
                            onChange={(e) =>
                              uploadFileHandler(e, "pas_photo", "image/")
                            }
                            required={!update}
                          />
                        )}
                      </div>
                      <div>
                        <label htmlFor="ijazah">ijazah asli dan terjemah</label>
                        {data.ijazah ? (
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              className="px-3 py-1.5 text-white bg-black border border-black rounded-lg"
                              onClick={() => openLink(data.ijazah)}
                            >
                              Open
                            </button>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() => setData({ ...data, ijazah: "" })}
                            >
                              remove
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            className="file-input"
                            id="ijazah"
                            accept=".pdf"
                            onChange={(e) =>
                              uploadFileHandler(e, "ijazah", "application/pdf")
                            }
                            required={!update}
                          />
                        )}
                      </div>
                      <div>
                        <label htmlFor="transkrip">
                          transkrip asli dan terjemah
                        </label>
                        {data.transkrip ? (
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              className="px-3 py-1.5 text-white bg-black border border-black rounded-lg"
                              onClick={() => openLink(data.transkrip)}
                            >
                              Open
                            </button>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() =>
                                setData({ ...data, transkrip: "" })
                              }
                            >
                              remove
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            className="file-input"
                            id="transkrip"
                            accept=".pdf"
                            onChange={(e) =>
                              uploadFileHandler(
                                e,
                                "transkrip",
                                "application/pdf"
                              )
                            }
                            required={!update}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col w-full gap-4">
                      <div>
                        <label htmlFor="paspor">paspor</label>
                        {data.paspor ? (
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              className="px-3 py-1.5 text-white bg-black border border-black rounded-lg"
                              onClick={() => openLink(data.paspor)}
                            >
                              Open
                            </button>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() => setData({ ...data, paspor: "" })}
                            >
                              remove
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            className="file-input"
                            id="paspor"
                            accept=".pdf"
                            onChange={(e) =>
                              uploadFileHandler(e, "paspor", "application/pdf")
                            }
                            required={!update}
                          />
                        )}
                      </div>
                      <div>
                        <label htmlFor="surat_rekomendasi">
                          surat rekomendasi
                        </label>
                        {data.surat_rekomendasi ? (
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              className="px-3 py-1.5 text-white bg-black border border-black rounded-lg"
                              onClick={() => openLink(data.surat_rekomendasi)}
                            >
                              Open
                            </button>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() =>
                                setData({ ...data, surat_rekomendasi: "" })
                              }
                            >
                              remove
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            className="file-input"
                            id="surat_rekomendasi"
                            accept=".pdf"
                            onChange={(e) =>
                              uploadFileHandler(
                                e,
                                "surat_rekomendasi",
                                "application/pdf"
                              )
                            }
                            required={!update}
                          />
                        )}
                      </div>
                      <div>
                        <label htmlFor="surat_izin">surat izin orang tua</label>
                        {data.surat_izin ? (
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              className="px-3 py-1.5 text-white bg-black border border-black rounded-lg"
                              onClick={() => openLink(data.surat_izin)}
                            >
                              Open
                            </button>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() =>
                                setData({ ...data, surat_izin: "" })
                              }
                            >
                              remove
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            className="file-input"
                            id="surat_izin"
                            accept=".pdf"
                            onChange={(e) =>
                              uploadFileHandler(
                                e,
                                "surat_izin",
                                "application/pdf"
                              )
                            }
                            required={!update}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 mb-4 rounded-md _green disabled:_gray"
                    disabled={loading}
                  >
                    Save
                  </button>
                </form>
              )}
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

  return { props: { user, navbarData } };
}
