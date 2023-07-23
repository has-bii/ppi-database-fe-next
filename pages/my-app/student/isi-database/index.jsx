import MyNavbar from "@components/MyNavbar";
import UserDashboard from "@components/UserDashboard";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import axios from "axios";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";

export default function index({ user, student, jurusans }) {
  const cookie = getCookie("user_token");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: student.id,
    user_id: student.user_id,
    name: student.name,
    email: student.email,
    no_aktif: student.no_aktif || "",
    whatsapp: student.whatsapp || "",
    jenis_kelamin: student.jenis_kelamin || "",
    tanggal_lahir: student.tanggal_lahir || "",
    no_paspor: student.no_paspor || "",
    paspor_exp: student.paspor_exp || "",
    tc_kimlik: student.tc_kimlik || "",
    kimlik_exp: student.kimlik_exp || "",
    provinsi_indonesia: student.provinsi_indonesia || "",
    kota_asal_indonesia: student.kota_asal_indonesia || "",
    alamat_lengkap_indonesia: student.alamat_lengkap_indonesia || "",
    tempat_tinggal: student.tempat_tinggal || "",
    kota_turki_id: student.kota_turki_id || "",
    alamat_turki: student.alamat_turki || "",
    tahun_ke: student.tahun_ke || "",
    universitas_turki_id: student.universitas_turki_id || "",
    jenjang_pendidikan: student.jenjang_pendidikan || "",
    jurusan_id: student.jurusan_id || "",
    tahun_kedatangan: student.tahun_kedatangan || "",
  });
  const photoRef = useRef();
  const ikametRef = useRef();
  const obelRef = useRef();
  const maxFileSize = 1024 * 1024;
  const [photoUrl, setPhotoUrl] = useState(
    student.photo ? `${process.env.NEXT_PUBLIC_API_URL}/${student.photo}` : ""
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append("tahun_ke", form.tahun_ke);
    formData.append("universitas_turki_id", form.universitas_turki_id);
    formData.append("jenjang_pendidikan", form.jenjang_pendidikan);
    formData.append("jurusan_id", form.jurusan_id);
    formData.append("tahun_kedatangan", form.tahun_kedatangan);

    if (photoRef.current.files[0])
      formData.append("photo", photoRef.current.files[0]);
    if (ikametRef.current.files[0])
      formData.append("ikamet_file", ikametRef.current.files[0]);
    if (obelRef.current.files[0])
      formData.append("ogrenci_belgesi", obelRef.current.files[0]);

    const res = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/student/update`, formData, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setStep(3);
        setLoading(false);
      })
      .catch((err) => console.log(err.response));
  };

  const uploadFileHandler = (i) => {
    switch (i) {
      case 0:
        if (photoRef.current.files[0]) {
          if (maxFileSize < photoRef.current?.files[0].size) {
            photoRef.current.value = "";
            setPhotoUrl(false);
            alert("File size exceeds maximum limit 1 MB");
          } else setPhotoUrl(URL.createObjectURL(photoRef.current.files[0]));
        } else
          setPhotoUrl(
            student.photo
              ? `${process.env.NEXT_PUBLIC_API_URL}/${student.photo}`
              : ""
          );

        break;

      case 1:
        if (ikametRef.current.files[0]) {
          if (maxFileSize < ikametRef.current.files[0].size) {
            ikametRef.current.value = "";
            alert("File size exceeds maximum limit 1 MB");
          }
        }
        break;

      case 2:
        if (obelRef.current.files[0]) {
          if (maxFileSize < obelRef.current.files[0].size) {
            obelRef.current.value = "";
            alert("File size exceeds maximum limit 1 MB");
          }
        }
        break;
    }
  };

  const changeForm = async (e, i) => {
    e.preventDefault();
    setLoading(true);

    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/student/update`, form, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setStep(i);
      })
      .catch((err) => console.log(err.response));
  };

  return (
    <div className="bg-base-grey">
      <Head>
        <title>My App | PPI Karabük</title>
      </Head>
      <div className="flex flex-col w-screen h-screen overflow-auto lg:flex-row _hide_scrollbar">
        {/* Navbar */}
        <MyNavbar role_id={user.role_id} />
        {/* Navbar End */}

        <div className="flex flex-col w-full gap-4 p-4">
          {/* User Info */}
          <UserDashboard pageName="Isi Database" user={user} />
          {/* User Info End */}

          {/* Contents */}
          <div className="w-full h-full gap-5 overflow-auto _card_myapp _hide_scrollbar">
            {/* Progress */}
            <div className="flex flex-col w-full gap-2">
              <div className="flex flex-row justify-between">
                <span className="font-bold ">
                  {step === 0
                    ? "0"
                    : step === 1
                    ? "33"
                    : step === 2
                    ? "66"
                    : 100}
                  % complete
                </span>
                <span className="text-gray-400 ">{step} of 3 forms</span>
              </div>
              <div className="_progress_bar">
                <span
                  className="bg-green-500 rounded-lg"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></span>
              </div>
            </div>
            {/* Progress */}

            {/* Forms */}
            {/* Form 1 */}
            {step === 0 && (
              <form
                className="_form_container"
                onSubmit={(e) => changeForm(e, 1)}
              >
                <span className="_form_header">General Info</span>
                <div className="_form">
                  <div className="_form_col">
                    <label htmlFor="nama">Nama</label>
                    <input
                      type="text"
                      placeholder="Nama lengkap"
                      id="nama"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      placeholder="Alamat email"
                      id="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="noaktif">Nomor aktif</label>
                    <input
                      type="text"
                      id="noaktif"
                      placeholder="Nomor aktif dengan kode negara"
                      value={form.no_aktif}
                      onChange={(e) =>
                        setForm({ ...form, no_aktif: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="nowa">Nomor Whatsapp</label>
                    <input
                      type="text"
                      id="nowa"
                      placeholder="Nomor Whatsapp dengan kode negara"
                      value={form.whatsapp}
                      onChange={(e) =>
                        setForm({ ...form, whatsapp: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="kelamin">Jenis kelamin</label>
                    <select
                      required
                      id="kelamin"
                      value={form.jenis_kelamin}
                      onChange={(e) =>
                        setForm({ ...form, jenis_kelamin: e.target.value })
                      }
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div className="_form_col">
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
                    <label htmlFor="no-paspor">Nomor Paspor</label>
                    <input
                      type="text"
                      placeholder="Nomor paspor"
                      id="no-paspor"
                      value={form.no_paspor}
                      onChange={(e) =>
                        setForm({ ...form, no_paspor: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="paspor-exp">Masa berlaku Paspor</label>
                    <input
                      type="date"
                      id="paspor-exp"
                      value={form.paspor_exp}
                      onChange={(e) =>
                        setForm({ ...form, paspor_exp: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="tc-kimlik">TC Kimlik</label>
                    <input
                      type="text"
                      id="tc-kimlik"
                      placeholder="Nomor TC Kimlik"
                      value={form.tc_kimlik}
                      onChange={(e) =>
                        setForm({ ...form, tc_kimlik: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="kimlik-exp">Masa berlaku Ikamet</label>
                    <input
                      type="date"
                      id="kimlik-exp"
                      value={form.kimlik_exp}
                      onChange={(e) =>
                        setForm({ ...form, kimlik_exp: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="ml-auto _blue"
                  disabled={loading}
                >
                  Next
                </button>
              </form>
            )}

            {/* Form 2 */}
            {step === 1 && (
              <form
                className="_form_container"
                onSubmit={(e) => changeForm(e, 2)}
              >
                <span className="_form_header">Address Information</span>
                <div className="_form">
                  <div className="_form_col">
                    <label htmlFor="provinsi">Provinsi</label>
                    <input
                      type="text"
                      placeholder="Asal Provinsi Indonesia"
                      id="provinsi"
                      value={form.provinsi_indonesia}
                      onChange={(e) =>
                        setForm({ ...form, provinsi_indonesia: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="kota-indonesia">Kota</label>
                    <input
                      type="text"
                      placeholder="Asal kota Indonesia"
                      id="kota-indonesia"
                      value={form.kota_asal_indonesia}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          kota_asal_indonesia: e.target.value,
                        })
                      }
                      required
                    />
                    <label htmlFor="alamat-lengkap-indonesia">
                      Alamat lengkap Indonesia
                    </label>
                    <textarea
                      id="alamat-lengkap-indonesia"
                      cols="30"
                      rows="4"
                      placeholder="Masukan alamat lengkap sesuai KTP"
                      value={form.alamat_lengkap_indonesia}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          alamat_lengkap_indonesia: e.target.value,
                        })
                      }
                      required
                    ></textarea>
                  </div>
                  <div className="_form_col">
                    <label htmlFor="tempat-tinggal">Tempat tinggal</label>
                    <select
                      id="tempat-tinggal"
                      value={form.tempat_tinggal}
                      onChange={(e) =>
                        setForm({ ...form, tempat_tinggal: e.target.value })
                      }
                      required
                    >
                      <option value="">Tempat tinggal di Turki</option>
                      <option value="Apartemen">Apartemen</option>
                      <option value="Asrama">Asrama</option>
                    </select>
                    <label htmlFor="kota-turki-id">Kota di Turki</label>
                    <select
                      id="kota-turki-id"
                      value={form.kota_turki_id}
                      onChange={(e) =>
                        setForm({ ...form, kota_turki_id: e.target.value })
                      }
                      required
                    >
                      <option value="">Pilih kota di Turki</option>
                      <option value="1">Bartın</option>
                      <option value="2">Karabük</option>
                      <option value="3">Zonguldak</option>
                    </select>
                    <label htmlFor="alamat-lengkap-turki">
                      Alamat lengkap Turki
                    </label>
                    <textarea
                      id="alamat-lengkap-turki"
                      cols="30"
                      rows="4"
                      value={form.alamat_turki}
                      onChange={(e) =>
                        setForm({ ...form, alamat_turki: e.target.value })
                      }
                      placeholder="Masukan alamat lengkap sesuai Ikametgah"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-end gap-4">
                  <button className="_gray" onClick={() => setStep(0)}>
                    Prev
                  </button>
                  <button type="submit" className="_blue" disabled={loading}>
                    Next
                  </button>
                </div>
              </form>
            )}

            {/* Form 3 */}
            {step === 2 && (
              <form className="_form_container" onSubmit={submitHandler}>
                <span className="_form_header">Education Information</span>
                <div className="_form">
                  <div className="_form_col">
                    <label htmlFor="tahun-kedatangan">Tahun kedatangan</label>
                    <input
                      type="number"
                      placeholder="Tahun kedatangan ke Turki"
                      id="tahun-kedatangan"
                      value={form.tahun_kedatangan}
                      onChange={(e) =>
                        setForm({ ...form, tahun_kedatangan: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="univ-turki">Universitas</label>
                    <select
                      id="univ-turki"
                      value={form.universitas_turki_id}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          universitas_turki_id: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Pilih Universitas di Turki</option>
                      <option value="1">Bartın Üniversitesi</option>
                      <option value="2">Karabük Üniversitesi</option>
                      <option value="3">
                        Zonguldak Bülent Ecevit Üniversitesi
                      </option>
                    </select>
                    <label htmlFor="jenjang">Jenjang pendidikan</label>
                    <select
                      id="jenjang"
                      value={form.jenjang_pendidikan}
                      onChange={(e) =>
                        setForm({ ...form, jenjang_pendidikan: e.target.value })
                      }
                      required
                    >
                      <option value="">Pendidikan yang sedang ditempuh</option>
                      <option value="Lise">Lise</option>
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                    </select>
                    <label htmlFor="jurusan">Jurusan</label>
                    <select
                      id="jurusan"
                      value={form.jurusan_id}
                      onChange={(e) =>
                        setForm({ ...form, jurusan_id: e.target.value })
                      }
                      required
                    >
                      <option value="">Pilih jurusan</option>
                      {jurusans.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.name}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="tahun-ke">Tahun ke</label>
                    <select
                      id="tahun-ke"
                      value={form.tahun_ke}
                      onChange={(e) =>
                        setForm({ ...form, tahun_ke: e.target.value })
                      }
                      required
                    >
                      <option value="">Pilih tahun</option>
                      <option value="TÖMER">TÖMER</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
                  </div>
                  <div className="_form_col">
                    <div className="flex flex-col gap-4 lg:mb-4 lg:items-end lg:flex-row">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          width={150}
                          height={150}
                          alt="Pas photo"
                        />
                      ) : (
                        <Image
                          src="/image/dummy-pp.jpeg"
                          alt="Pas photo"
                          width={150}
                          height={150}
                        />
                      )}
                      <div>
                        <label htmlFor="photo-file">Pas foto</label>
                        <input
                          type="file"
                          className="_file_input"
                          id="photo-file"
                          ref={photoRef}
                          accept="image/*"
                          onChange={() => uploadFileHandler(0)}
                        />
                      </div>
                    </div>
                    <label htmlFor="kimlik-file">Ikamet scanned file</label>
                    <input
                      type="file"
                      className="_file_input"
                      id="kimlik-file"
                      ref={ikametRef}
                      accept=".pdf"
                      onChange={() => uploadFileHandler(1)}
                    />
                    <label htmlFor="obel-file">Öğrenci Belgesi</label>
                    <input
                      type="file"
                      className="_file_input"
                      id="obel-file"
                      ref={obelRef}
                      accept=".pdf"
                      onChange={() => uploadFileHandler(2)}
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-end gap-4">
                  <button className="_gray" onClick={() => setStep(1)}>
                    Prev
                  </button>
                  <button type="submit" className="_blue" disabled={loading}>
                    Submit
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 my-4">
                <div className="text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="8rem"
                    viewBox="0 0 576 512"
                    className=" fill-green-500"
                  >
                    <path d="M96 80c0-26.5 21.5-48 48-48H432c26.5 0 48 21.5 48 48V384H96V80zm313 47c-9.4-9.4-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L409 161c9.4-9.4 9.4-24.6 0-33.9zM0 336c0-26.5 21.5-48 48-48H64V416H512V288h16c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336z" />
                  </svg>
                </div>
                <h1 className="text-5xl font-bold">Thank you!</h1>
                <p className="text-lg text-center text-gray-400">
                  Your form was successfully submitted!
                </p>
              </div>
            )}

            {/* Forms End */}
          </div>
          {/* Contents end */}
        </div>
      </div>
    </div>
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

  const student = await fetchData("/student", req, res);

  if (!student)
    return {
      redirect: {
        destination: "/500",
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

  return { props: { user, student, jurusans } };
}
