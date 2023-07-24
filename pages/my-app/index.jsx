import BarChart from "@components/BarChart";
import LineChart from "@components/LineChart";
import MyNavbar from "@components/MyNavbar";
import UserDashboard from "@components/UserDashboard";
import { fetchData } from "@lib/fetchData";
import { fetchUser } from "@lib/fetchUser";
import axios from "axios";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import Head from "next/head";
import { useState } from "react";

export const selectAnalytics = [
  "Perkembangan perdaerah",
  "Jumlah mahasiswa",
  "Jurusan favorit",
  "Asal daerah Indonesia",
  "Status",
  "Jenjang pendidikan",
];

export default function index({ user, analytics }) {
  const [selectedChart, setSelectedChart] = useState(1);

  const dataStudent = {
    labels: analytics.student.label.map((l) => l),
    datasets: [
      {
        label: "Mahasiswa Bartın",
        data: analytics.student.bartin.map((b) => b.count),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Mahasiswa Karabük",
        data: analytics.student.karabuk.map((k) => k.count),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Mahasiswa Zonguldak",
        data: analytics.student.zonguldak.map((z) => z.count),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const dataJurusan = {
    labels: analytics.jurusan.map((j) => j.jurusan.name),
    datasets: [
      {
        label: "# of students",
        data: analytics.jurusan.map((j) => j.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const dataDaerah = {
    labels: ["Bartın", "Karabük", "Zonguldak"],
    datasets: [
      {
        label: "# of students",
        data: [
          analytics.student.bartin[5].count,
          analytics.student.karabuk[5].count,
          analytics.student.zonguldak[5].count,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const dataAsal = {
    labels: analytics.asal_kota.map((a) => a.kota_asal_indonesia),
    datasets: [
      {
        label: "# of students",
        data: analytics.asal_kota.map((a) => a.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const dataStatus = {
    labels: analytics.status.map((s) => s.status.name),
    datasets: [
      {
        label: "# of students",
        data: analytics.status.map((s) => s.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const dataPendidikan = {
    labels: analytics.jenjang_pendidikan.map((j) => j.jenjang_pendidikan),
    datasets: [
      {
        label: "# of students",
        data: analytics.jenjang_pendidikan.map((j) => j.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-base-grey">
      <Head>
        <title>My App | PPI Karabük</title>
      </Head>
      <div className="flex flex-col w-screen h-screen overflow-auto _hide_scrollbar lg:overflow-hidden lg:flex-row">
        <MyNavbar role_id={user.role_id} />
        <div className="flex flex-col w-full gap-4 p-4">
          <UserDashboard pageName="Dashboard" user={user} />

          {/* Content */}
          <div className="_myapp_content">
            {/* Analytics overview */}
            <div>
              <p className="mb-3 text-xl font-semibold">Analytics overview</p>
              <div className="flex flex-row w-full gap-2 overflow-x-auto _hide_scrollbar">
                <div className="_overview_card">
                  <h4 className="_overview_amount">
                    {analytics.active_student}
                  </h4>
                  <span className="_overview_info">Active Students</span>
                </div>
                {analytics.kota.map((kota, index) => (
                  <div key={index} className="_overview_card">
                    <h4 className="_overview_amount">{kota.count}</h4>
                    <span className="_overview_info">{`${kota.kota_turki.name} Students`}</span>
                  </div>
                ))}
                {analytics.gender.map((gender, index) => (
                  <div key={index} className="_overview_card">
                    <h4 className="_overview_amount">{gender.count}</h4>
                    <span className="_overview_info">
                      {gender.jenis_kelamin}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Analytics overview end */}

            {/* Charts */}
            <div className="flex flex-col-reverse w-full h-full gap-4 md:flex-row">
              <div className="flex px-4 py-2 border-2 border-black rounded-lg md:w-3/4">
                {selectedChart === 1 && <LineChart data={dataStudent} />}
                {selectedChart === 2 && (
                  <BarChart data={dataDaerah} title="Jumlah Mahasiswa" />
                )}
                {selectedChart === 3 && (
                  <BarChart data={dataJurusan} title="Jurusan Favorit" />
                )}
                {selectedChart === 4 && (
                  <BarChart
                    data={dataAsal}
                    title="Asal daerah Indonesia terbanyak"
                  />
                )}
                {selectedChart === 5 && (
                  <BarChart
                    data={dataStatus}
                    title="Jumlah mahasiswa perstatus"
                  />
                )}
                {selectedChart === 6 && (
                  <BarChart
                    data={dataPendidikan}
                    title="Jumlah mahasiswa perstatus"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2 p-4 overflow-hidden border-2 border-black rounded-lg md:w-1/4">
                <h4 className="text-2xl font-semibold">Select analytics</h4>
                <ul className="flex flex-col gap-2">
                  {selectAnalytics.map((select, index) => (
                    <li
                      key={index}
                      className={`_select_analytics ${
                        selectedChart === index + 1 ? "_selected" : ""
                      }`}
                      onClick={() => setSelectedChart(index + 1)}
                    >
                      {select}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Charts end */}
          </div>
          {/* Content End */}
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

  const analytics = await fetchData("/student/statistic", req, res);

  if (!analytics)
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };

  return { props: { user, analytics } };
}
