import MyNavbar from "@components/MyNavbar";
import UserDashboard from "@components/UserDashboard";
import { fetchUser } from "@lib/fetchUser";
import { getNavbarData } from "@lib/getNavbarData";
import { hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { useState } from "react";

export default function index({ user, navbarData }) {
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
  return (
    <>
      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-full lg:flex-row">
          <MyNavbar role_id={user.role_id} data={navbarData} />
          <div className="flex flex-col w-full gap-4 p-4 overflow-hidden">
            {/* User info */}
            <UserDashboard pageName="Biodata" user={user} />

            {/* Contents */}
            <div className="_myapp_content">
              <form className="flex flex-col w-full h-full gap-2">
                <h3 className="text-lg font-semibold capitalize">Data diri</h3>
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
                        placeholder="+62800011112222"
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
                        placeholder="+62800011112222"
                        value={data.no_hp}
                        onChange={(e) =>
                          setData({ ...data, no_hp: e.target.value })
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
                      <input
                        type="file"
                        className="file-input"
                        id="pas_photo"
                        accept="image/*"
                      />
                    </div>
                    <div>
                      <label htmlFor="ijazah">ijazah asli dan terjemah</label>
                      <input
                        type="file"
                        className="file-input"
                        id="ijazah"
                        accept=".pdf"
                      />
                    </div>
                    <div>
                      <label htmlFor="transkrip">transkrip</label>
                      <input
                        type="file"
                        className="file-input"
                        id="transkrip"
                        accept=".pdf"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-full gap-4">
                    <div>
                      <label htmlFor="paspor">paspor</label>
                      <input
                        type="file"
                        className="file-input"
                        id="paspor"
                        accept=".pdf"
                      />
                    </div>
                    <div>
                      <label htmlFor="surat_rekomendasi">
                        surat rekomendasi
                      </label>
                      <input
                        type="file"
                        className="file-input"
                        id="surat_rekomendasi"
                        accept=".pdf"
                      />
                    </div>
                    <div>
                      <label htmlFor="surat_izin">surat izin</label>
                      <input
                        type="file"
                        className="file-input"
                        id="surat_izin"
                        accept=".pdf"
                      />
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 mb-4 rounded-md _green">
                  Submit
                </button>
              </form>
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
