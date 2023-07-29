import MyNavbar from "@components/MyNavbar";
import Toast from "@components/Toast";
import UserDashboard from "@components/UserDashboard";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import axios from "axios";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { useState } from "react";

export default function index({ user, jurusans, new_student }) {
  const cookie = getCookie("user_token");
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState([]);
  const [form, setForm] = useState({
    jenis_kelamin: new_student.jenis_kelamin,
    tanggal_lahir: new_student.tanggal_lahir,
    provinsi_indonesia: new_student.provinsi_indonesia,
    kota_asal_indonesia: new_student.kota_asal_indonesia,
    alamat_lengkap_indonesia: new_student.alamat_lengkap_indonesia,
    whatsapp: new_student.whatsapp,
    no_paspor: new_student.no_paspor,
    jenjang_pendidikan: new_student.jenjang_pendidikan,
    jurusan_id: new_student.jurusan_id,
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    setToastData((prev) => [
      ...prev,
      { title: "Loading", body: "Sending data to the server" },
    ]);

    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/newstudents/update`, form, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setLoading(false);
        return "Data submitted successfully";
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        return null;
      });

    setToastData((prev) => [
      ...prev,
      { title: "Success", body: response, style: "_success" },
    ]);
  };

  return (
    <>
      {/* Toast */}
      <Toast
        toastData={toastData}
        setToastData={setToastData}
        position="top-0 right-0"
      />
      {/* Toast end */}

      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-screen overflow-auto _hide_scrollbar lg:flex-row">
          <MyNavbar role_id={user.role_id} />
          <div className="flex flex-col w-full gap-4 p-4">
            {/* User info */}
            <UserDashboard pageName="Users" user={user} />

            {/* Contents */}
            <div className="_myapp_content">
              <form className="_form_container" onSubmit={submitHandler}>
                <span className="_form_header">Daftar Karabük University</span>
                <div className="_form">
                  <div className="_form_col">
                    <label htmlFor="nama">Nama</label>
                    <input
                      type="text"
                      placeholder="Nama lengkap"
                      id="nama"
                      name="name"
                      value={new_student?.name}
                      readOnly
                    />
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      placeholder="Alamat email"
                      id="email"
                      name="email"
                      value={new_student?.email}
                      readOnly
                    />
                    <label htmlFor="kelamin">Jenis kelamin</label>
                    <select
                      required
                      id="kelamin"
                      name="jenis_kelamin"
                      value={form.jenis_kelamin}
                      onChange={(e) =>
                        setForm({ ...form, jenis_kelamin: e.target.value })
                      }
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    <label htmlFor="tanggal-lahir">Tanggal lahir</label>
                    <input
                      type="date"
                      id="tanggal-lahir"
                      name="jenis_kelamin"
                      required
                      value={form.tanggal_lahir}
                      onChange={(e) =>
                        setForm({ ...form, tanggal_lahir: e.target.value })
                      }
                    />
                    <label htmlFor="whatsapp">Nomor Whatsapp</label>
                    <input
                      type="text"
                      id="whatsapp"
                      name="whatsapp"
                      placeholder="Nomor Whatsapp dengan kode negara"
                      required
                      value={form.whatsapp}
                      onChange={(e) =>
                        setForm({ ...form, whatsapp: e.target.value })
                      }
                    />
                    <label htmlFor="no-paspor">Nomor Paspor</label>
                    <input
                      type="text"
                      placeholder="Nomor paspor"
                      id="no-paspor"
                      name="no_paspor"
                      required
                      value={form.no_paspor}
                      onChange={(e) =>
                        setForm({ ...form, no_paspor: e.target.value })
                      }
                    />
                  </div>
                  <div className="_form_col">
                    <label htmlFor="jenjang">Jenjang pendidikan</label>
                    <select
                      id="jenjang"
                      name="jenjang_pendidikan"
                      required
                      value={form.jenjang_pendidikan}
                      onChange={(e) =>
                        setForm({ ...form, jenjang_pendidikan: e.target.value })
                      }
                    >
                      <option value="">Pendidikan yang akan ditempuh</option>
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                    </select>
                    <label htmlFor="jurusan">Jurusan</label>
                    <select
                      id="jurusan"
                      name="jurusan_id"
                      required
                      value={form.jurusan_id}
                      onChange={(e) =>
                        setForm({ ...form, jurusan_id: e.target.value })
                      }
                    >
                      <option value="">Pilih jurusan</option>
                      {jurusans.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.name}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="provinsi-indonesia">Provinsi</label>
                    <input
                      type="text"
                      id="provinsi-indonesia"
                      name="provinsi_indonesia"
                      placeholder="Masukan asal provinsi"
                      required
                      value={form.provinsi_indonesia}
                      onChange={(e) =>
                        setForm({ ...form, provinsi_indonesia: e.target.value })
                      }
                    />
                    <label htmlFor="kota-asal">Kota</label>
                    <input
                      type="text"
                      id="kota-asal"
                      name="kota_indonesia"
                      placeholder="Masukan asal kota"
                      required
                      value={form.kota_asal_indonesia}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          kota_asal_indonesia: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="alamat-lengkap">Alamat lengkap</label>
                    <textarea
                      id="alamat-lengkap"
                      name="alamat_lengkap"
                      placeholder="Masukan alamat lengkap"
                      cols="30"
                      rows="4"
                      required
                      value={form.alamat_lengkap_indonesia}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          alamat_lengkap_indonesia: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="ml-auto _green"
                  disabled={loading}
                >
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

  const jurusans = await fetchData("/jurusan", req, res);

  if (!jurusans)
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };

  const new_student = await fetchData("/newstudents", req, res, {
    user_id: user.id,
  });

  return { props: { user, jurusans, new_student } };
}
