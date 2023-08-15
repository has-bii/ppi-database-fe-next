import MyNavbar from "@components/MyNavbar";
import { useToastContext } from "@components/ToastContext";
import UserDashboard from "@components/UserDashboard";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import { getNavbarData } from "@lib/getNavbarData";
import { sendData } from "@lib/sendData";
import { hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import BCA from "@public/image/bca-logo.png";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const departments = [
  "Accounting and Tax Applications",
  "Actuarial Sciences",
  "Applied English Translation",
  "Archeology",
  "Architecture",
  "Art History",
  "Audiometry",
  "Automotive Engineering",
  "Automotive Technology",
  "Autopsy Assistant",
  "Biomedical Engineering",
  "Bus Captaincy",
  "Business Administration",
  "Chemistry",
  "Child Development",
  "Child Development",
  "Civil Defense and Firefighting",
  "Civil Engineering",
  "Computer Engineering",
  "Computer Programming",
  "Computer Programming",
  "Computer Technology",
  "Cooking",
  "Dental Health",
  "Dentistry",
  "Economy",
  "Eflani Vocational School",
  "Elderly Care",
  "Electrical Engineering",
  "Electrical-Electronics Engineering",
  "Electronic Technology",
  "Energy System Engineering",
  "English Language and Literature",
  "Eskipazar Vocational School",
  "Fashion Design",
  "Finance and Banking",
  "First Aid and Emergency Care",
  "Food Quality Control and Analysis",
  "Forest Engineering",
  "Gastronomy and Culinary Arts",
  "Geography",
  "Graphic Design",
  "Healthcare Facility Management",
  "History",
  "HVAC and Refrigeration Technology",
  "Industrial Design",
  "Industrial Design Engineering",
  "Industrial Engineering",
  "Information Security Technology",
  "Interior Design",
  "Interior Design",
  "Internasional Relation",
  "Islamic Science",
  "Journalism",
  "Justice",
  "Manufacturing Engineering",
  "Math",
  "Mechanical Engineering",
  "Mechanical Engineering",
  "Mechatronics Engineering",
  "Mechatronics Engineering",
  "Medical Documentation and Secretarial Services",
  "Medical Laboratory Techniques",
  "Medical Promotion and Marketing",
  "Medical Sciences",
  "Metallurgical and Materials Engineering",
  "Metallurgy",
  "Midwifery",
  "Music",
  "Nursing",
  "Occupational Health and Safety",
  "Occupational Health and Safety",
  "Occupational Health and Services",
  "Operating Room Services",
  "Opticianry",
  "Orthopedic Prosthetics and Orthotics",
  "Painting",
  "Philosophy",
  "Physics",
  "Physiotherapy",
  "Physiotherapy and Rehabilitation",
  "Political Sciences and Public Administration",
  "Private Security and Protection",
  "Public Relation and Advertising",
  "Radio",
  "Radio and Television Programming",
  "Rail System Mechanical Technology",
  "Rail Systems Machining",
  "Railway System Engineering",
  "Recreation Management",
  "School of Health Services",
  "Social Work",
  "Sociology",
  "Software Engineering",
  "Sport Management",
  "Tourism and Hotel Management",
  "Tourism Guiding",
  "Tourism Management",
  "Tourist Guiding",
  "Traditional Handicrafts",
  "Transportation and Traffic Services",
  "Turkish Language and Literature",
];

const noRek = process.env.NEXT_PUBLIC_REK;
const namaRek = process.env.NEXT_PUBLIC_NAMA_REK;
const maxFileSize = 1024 * 1024 * process.env.NEXT_PUBLIC_MAX_FILE_SIZE;

export default function Index({
  user,
  navbarData,
  applicationData,
  user_app_data,
}) {
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({ receipt: "" });
  const router = useRouter();

  const [form, setForm] = useState({
    app_status_id: 4,
    education_id: 1,
    nilai_ujian: "",
    jurusan_1: "",
    jurusan_2: "",
    jurusan_3: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData();

    formData.append("application_id", applicationData.id);
    formData.append("education_id", form.education_id);
    formData.append("nilai_ujian", form.nilai_ujian.replace(",", "."));
    formData.append("jurusan_1", form.jurusan_1);
    formData.append("jurusan_2", form.jurusan_2);
    formData.append("jurusan_3", form.jurusan_3);
    formData.append("receipt", files.receipt);

    const res = await sendData("/user-app/create", formData);
    setToastLoading("Sending data...");

    if (res) {
      setToastSuccess("Sent successfully");
      router.push("/my-app/user/daftar-kampus");
    } else setToastFailed();

    setLoading(false);
  };

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

  const openLink = (link) => {
    window.open(process.env.NEXT_PUBLIC_API_URL + "/" + link, "_blank");
  };

  const formatNumber = (number) => {
    const stringNum = number.toString();
    const newNum = stringNum.slice(0, 3) + "." + stringNum.slice(3);

    return newNum;
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
            <UserDashboard pageName="Daftar Kampus" user={user} />

            {/* Contents */}
            <div className="myapp_content">
              {user_app_data === null ? (
                <form
                  onSubmit={submitHandler}
                  className="flex flex-col w-full gap-2"
                >
                  <h3 className="text-lg font-semibold capitalize">
                    {applicationData.name}
                  </h3>
                  <div className="flex flex-col gap-4 p-6 mb-4 lg:gap-12 lg:flex-row form">
                    {/* Left */}
                    <div className="flex flex-col w-full gap-4">
                      <div>
                        <label htmlFor="nilai_ujian">Rata-rata Nilai</label>
                        <input
                          type="text"
                          name="nilai_ujian"
                          placeholder="Gunakan titik untuk desimal"
                          required
                          value={form.nilai_ujian}
                          onChange={(e) =>
                            setForm({ ...form, nilai_ujian: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="education_id">Program studi</label>
                        <select
                          type="text"
                          name="education_id"
                          required
                          value={form.education_id}
                          onChange={(e) =>
                            setForm({ ...form, education_id: e.target.value })
                          }
                        >
                          <option value="">Pilih program studi</option>
                          <option value="3">S1</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="jurusan_1">Pilihan jurusan 1</label>
                        <select
                          type="text"
                          name="jurusan_1"
                          required
                          value={form.jurusan_1}
                          onChange={(e) =>
                            setForm({ ...form, jurusan_1: e.target.value })
                          }
                        >
                          {departments.map((department, i) => (
                            <option key={i} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="jurusan_2">Pilihan jurusan 2</label>
                        <select
                          type="text"
                          name="jurusan_2"
                          required
                          value={form.jurusan_2}
                          onChange={(e) =>
                            setForm({ ...form, jurusan_2: e.target.value })
                          }
                        >
                          {departments.map((department, i) => (
                            <option key={i} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="jurusan_3">Pilihan jurusan 3</label>
                        <select
                          type="text"
                          name="jurusan_3"
                          required
                          value={form.jurusan_3}
                          onChange={(e) =>
                            setForm({ ...form, jurusan_3: e.target.value })
                          }
                        >
                          {departments.map((department, i) => (
                            <option key={i} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Right */}
                    <div className="flex flex-col w-full gap-4">
                      <div className="flex flex-col w-full h-full gap-2 p-4 rounded-md bg-sky-700">
                        <h2 className="text-lg font-semibold text-white">
                          Biaya Pendaftaran
                        </h2>
                        <div className="w-full p-2 bg-white rounded shadow-md">
                          <span className="text-sm text-slate-500">Total</span>
                          <p className="text-lg font-bold text-black ">
                            Rp{formatNumber(380000 + user.id)}
                          </p>
                        </div>
                        <div className="w-full p-2 bg-white rounded shadow-md">
                          <div className="inline-flex items-center justify-between w-full">
                            <h3 className="text-lg font-semibold text-black">
                              Transfer Bank BCA
                            </h3>
                            <Image
                              src={BCA}
                              height={36}
                              style={{ width: "auto" }}
                              alt=""
                            />
                          </div>

                          <p className=" text-slate-500">
                            Lakukan transfer ke rekening BCA <b>{noRek}</b> a.n{" "}
                            <b>{namaRek}</b>, kemudian upload bukti transfer di
                            bawah ini.
                          </p>

                          <div className="mt-8">
                            <label htmlFor="receipt">Bukti transfer</label>
                            <input
                              type="file"
                              className="file-input"
                              id="receipt"
                              accept="image/png,image/jpg,image/jpeg"
                              onChange={(e) =>
                                uploadFileHandler(e, "receipt", "image/")
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 mb-4 rounded-md _green disabled:_gray"
                    disabled={loading}
                  >
                    Submit
                  </button>
                </form>
              ) : (
                <div className="w-full overflow-hidden border divide-y rounded-md border-slate-300 divide-slate-300">
                  <h3 className="px-4 py-2 text-lg font-semibold capitalize bg-slate-100">
                    {user_app_data?.application?.name}
                  </h3>
                  <table className="w-full table-fixed biodata">
                    <tbody>
                      <tr className="capitalize divide-x divide-slate-300">
                        <td className="lg:w-1/5">Program studi</td>
                        <td>{user_app_data?.education?.name}</td>
                      </tr>
                      <tr className="capitalize divide-x divide-slate-300">
                        <td>Rata-rata nilai</td>
                        <td>{user_app_data?.nilai_ujian}</td>
                      </tr>
                      <tr className="capitalize divide-x divide-slate-300">
                        <td>Pilihan 1</td>
                        <td>{user_app_data?.jurusan_1}</td>
                      </tr>
                      <tr className="capitalize divide-x divide-slate-300">
                        <td>Pilihan 2</td>
                        <td>{user_app_data?.jurusan_2}</td>
                      </tr>
                      <tr className="capitalize divide-x divide-slate-300">
                        <td>Pilihan 3</td>
                        <td>{user_app_data?.jurusan_3}</td>
                      </tr>
                      <tr className="capitalize divide-x divide-slate-300">
                        <td>Bukti pembayaran</td>
                        <td>
                          <button
                            onClick={() => openLink(user_app_data.receipt)}
                            className="px-3 py-1.5 bg-black text-white rounded-lg"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                      <tr className="capitalize divide-x divide-slate-300">
                        <td>Status</td>
                        <td>
                          <span
                            className={
                              "px-3 py-1.5 rounded-xl text-sm _" +
                              user_app_data?.app_status?.style
                            }
                          >
                            {user_app_data.app_status.name}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
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

  const navbarData = await getNavbarData({ req, res });

  const applicationData = await fetchData("/application", req, res, params);

  if (!applicationData)
    return {
      redirect: {
        destination: "/my-app/user/daftar-kampus",
        permanent: false,
      },
    };

  const user_app_data = await fetchData("/user-app", req, res, {
    application_id: applicationData.id,
    user_id: user.id,
  });

  return { props: { user, navbarData, applicationData, user_app_data } };
}
