import MyNavbar from "@components/MyNavbar";
import UserDashboard from "@components/UserDashboard";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import { isUser } from "@lib/isRole";
import { useToastContext } from "@pages/ToastContext";
import axios from "axios";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const maxFileSize = 1024 * 1024;
const applications = [
  {
    title: "Pendaftaran S1 Karabük University Jalur Berkas 2023/2024",
    status: true,
    start_date: "10-10-2023",
    end_date: "1-11-2023",
  },
  {
    title: "Ganti Jurusan",
    status: false,
    start_date: "25-12-2023",
    end_date: "1-1-2024",
  },
];

export default function index({ user, jurusans, user_info }) {
  const router = useRouter();
  const cookie = getCookie("user_token");
  const [loading, setLoading] = useState(false);
  const { setToastFailed, setToastLoading, setToastSuccess } =
    useToastContext();
  const [form, setForm] = useState({
    gender: "",
    tanggal_lahir: "",
    whatsapp: "",
    provinsi: "",
    kota: "",
    alamat: "",
    pas_photo: "",
  });

  useEffect(() => {
    if (user_info)
      setForm({
        gender: user_info.gender,
        tanggal_lahir: user_info.tanggal_lahir,
        whatsapp: user_info.whatsapp,
        provinsi: user_info.provinsi,
        kota: user_info.kota,
        alamat: user_info.alamat,
        pas_photo: "",
      });
  }, []);

  const submitHandler = async (e, i) => {
    e.preventDefault();

    setLoading(true);
    setToastLoading("Saving biodata...");

    const formData = new FormData();

    formData.append("gender", form.gender);
    formData.append("tanggal_lahir", form.tanggal_lahir);
    formData.append("whatsapp", form.whatsapp);
    formData.append("provinsi", form.provinsi);
    formData.append("kota", form.kota);
    formData.append("alamat", form.alamat);

    if (form.pas_photo) formData.append("pas_photo", form.pas_photo);

    if (i === 1) {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user-info/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${cookie}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          setToastSuccess("Data saved successfully...");
          router.refresh();
        })
        .catch((err) => {
          console.log(err?.response);
          setToastFailed();
        });
    } else if (i === 2) {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user-info/update`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${cookie}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          setToastSuccess("Data saved successfully...");
        })
        .catch((err) => {
          console.log(err?.response);
          setToastFailed();
        });
    }
  };

  const uploadFileHandler = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].size > maxFileSize) {
        alert("File size exceeds maximum limit 1 MB");
        e.target.value = "";
      } else setForm({ ...form, pas_photo: e.target.files[0] });
    } else setForm({ ...form, pas_photo: "" });
  };

  return (
    <>
      <div className="bg-base-grey">
        <Head>
          <title>My App | PPI Karabük</title>
        </Head>
        <div className="flex flex-col w-screen h-screen overflow-auto _hide_scrollbar lg:flex-row">
          <MyNavbar role_id={user.role_id} />
          <div className="flex flex-col w-full gap-4 p-4">
            {/* User info */}
            <UserDashboard pageName="Daftar Kuliah" user={user} />

            {/* Contents */}
            <div className="_myapp_content">
              <div className="flex flex-col gap-4">
                {/* Applications */}
                {user_info !== null ? (
                  <>
                    <div className="overflow-hidden border border-gray-200 rounded-md">
                      <div className="px-4 py-2 text-xl font-semibold bg-gray-100">
                        Pendaftaran
                      </div>
                      <div className="flex flex-col gap-2 divide-y divide-gray-200">
                        {applications.map((app, index) => (
                          <div
                            key={index}
                            className="flex flex-row items-center justify-between w-full px-4 py-2"
                          >
                            <div className="flex-col w-4/5">
                              <div className="text-lg font-semibold">
                                {app.title}
                              </div>
                              <div className="text-sm text-gray-400 truncate font-base">
                                Tanggal: {app.start_date} {app.end_date}
                              </div>
                            </div>
                            <button
                              className={`px-3 py-1.5 border rounded-md ${
                                app.status
                                  ? "border-green-400 bg-green-300 text-green-500"
                                  : "border-red-400 bg-red-300 text-red-500"
                              }`}
                              disabled={!app.status}
                            >
                              Apply
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="overflow-hidden border border-gray-200 rounded-md">
                      <div className="px-4 py-2 text-xl font-semibold bg-gray-100">
                        Biodata diri
                      </div>
                      <form
                        onSubmit={(e) => submitHandler(e, 2)}
                        className="flex flex-col w-full p-4 lg:gap-4 lg:flex-row"
                      >
                        <Image
                          src={
                            process.env.NEXT_PUBLIC_API_URL +
                            `/` +
                            user_info.pas_photo
                          }
                          width={200}
                          height={250}
                          alt=""
                          className="object-cover p-2 mb-4 border border-gray-200 rounded-sm lg:mb-0"
                        />
                        <div className="w-full">
                          <div className="mb-4">
                            <label
                              htmlFor="name"
                              className="block text-sm text-gray-400"
                            >
                              Nama lengkap
                            </label>
                            <input
                              type="text"
                              id="name"
                              value={user_info.name}
                              readOnly
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="email"
                              className="block text-sm text-gray-400"
                            >
                              Email
                            </label>
                            <input
                              type="text"
                              id="email"
                              value={user_info.email}
                              readOnly
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="gender"
                              className="block text-sm text-gray-400"
                            >
                              Kelamin
                            </label>
                            <input
                              type="text"
                              id="gender"
                              value={user_info.gender}
                              readOnly
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="tanggal_lahir"
                              className="block text-sm text-gray-400"
                            >
                              Tanggal lahir
                            </label>
                            <input
                              type="date"
                              id="tanggal_lahir"
                              value={form.tanggal_lahir}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  tanggal_lahir: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="mb-4">
                            <label
                              htmlFor="whatsapp"
                              className="block text-sm text-gray-400"
                            >
                              Whatsapp
                            </label>
                            <input
                              type="text"
                              id="whatsapp"
                              value={form.whatsapp}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  whatsapp: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="provinsi"
                              className="block text-sm text-gray-400"
                            >
                              Provinsi
                            </label>
                            <input
                              type="text"
                              id="provinsi"
                              value={form.provinsi}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  provinsi: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="kota"
                              className="block text-sm text-gray-400"
                            >
                              Kota
                            </label>
                            <input
                              type="text"
                              id="kota"
                              value={form.kota}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  kota: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="alamat"
                              className="block text-sm text-gray-400"
                            >
                              Alamat
                            </label>
                            <input
                              type="text"
                              id="alamat"
                              value={form.alamat}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  alamat: e.target.value,
                                })
                              }
                              className="w-full"
                            />
                          </div>
                        </div>
                        <button type="submit" hidden>
                          submit
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <form
                    className="_form_container"
                    onSubmit={(e) => submitHandler(e, 1)}
                  >
                    <span className="_form_header">Biodata Diri</span>
                    <div className="_form">
                      <div className="_form_col">
                        <label htmlFor="name">Nama lengkap</label>
                        <input
                          type="text"
                          placeholder="Masukan nama lengkap"
                          id="name"
                          className="text-gray-400"
                          value={user.name}
                          readOnly
                        />
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          placeholder="Masukan alamat email"
                          id="email"
                          className="text-gray-400"
                          value={user.email}
                          readOnly
                        />
                        <label htmlFor="gender">Kelamin</label>
                        <select
                          id="gender"
                          value={form.gender}
                          onChange={(e) =>
                            setForm({ ...form, gender: e.target.value })
                          }
                          required
                        >
                          <option value="">Pilih jenis kelamin</option>
                          <option value="laki-laki">Laki-laki</option>
                          <option value="perempuan">Perempuan</option>
                        </select>
                        <label htmlFor="tanggal-lahir">Tanggal lahir</label>
                        <input
                          type="date"
                          id="tanggal-lahir"
                          value={form.tanggal_lahir}
                          onChange={(e) =>
                            setForm({ ...form, tanggal_lahir: e.target.value })
                          }
                          required
                        />
                        <label htmlFor="whatsapp">Whatsapp</label>
                        <input
                          type="text"
                          id="whatsapp"
                          value={form.whatsapp}
                          placeholder="Dengan kode negara +62"
                          onChange={(e) =>
                            setForm({ ...form, whatsapp: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="_form_col">
                        <label htmlFor="photo-file">Pas foto</label>
                        <input
                          type="file"
                          className="_file_input"
                          id="photo-file"
                          accept="image/*"
                          onChange={uploadFileHandler}
                          required
                        />
                        <label htmlFor="provinsi">Provinsi</label>
                        <input
                          type="text"
                          id="provinsi"
                          value={form.provinsi}
                          placeholder="Masukan Provinsi"
                          onChange={(e) =>
                            setForm({ ...form, provinsi: e.target.value })
                          }
                          required
                        />
                        <label htmlFor="kota">Kota</label>
                        <input
                          type="text"
                          id="kota"
                          value={form.kota}
                          placeholder="Masukan kota"
                          onChange={(e) =>
                            setForm({ ...form, kota: e.target.value })
                          }
                          required
                        />
                        <label htmlFor="alamat">Alamat lengkap</label>
                        <textarea
                          type="text"
                          id="alamat"
                          cols="30"
                          rows="4"
                          value={form.alamat}
                          placeholder="Masukan alamat lengkap"
                          onChange={(e) =>
                            setForm({ ...form, alamat: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-row justify-end gap-4">
                      <button
                        type="submit"
                        className="_green"
                        disabled={loading}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}
                {/* Applications end */}
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

  // Check if the role is user
  if (!isUser(user))
    return {
      redirect: {
        destination: "/my-app",
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

  const user_info = await fetchData("/user-info", req, res, {
    user_id: user.id,
  });

  return { props: { user, jurusans, user_info } };
}
