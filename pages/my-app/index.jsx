import MyNavbar from "@components/MyNavbar";
import UserDashboard from "@components/UserDashboard";
import axios from "axios";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import Head from "next/head";

export default function index({ user, analytics }) {
  return (
    <div className="bg-base-grey">
      <Head>
        <title>My App | PPI Karabük</title>
      </Head>
      <div className="flex flex-col w-screen h-screen overflow-hidden lg:flex-row">
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
            <div className="flex flex-row w-full h-full">
              <div className="flex w-3/4 border-2 border-black rounded-lg"></div>
            </div>
            {/* Charts end */}
          </div>
          {/* Content End */}
        </div>
      </div>
    </div>
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
  setCookie("user_token", cookie, { req, res, maxAge: 60 * 6 * 24 * 24 });

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
      return null;
    });

  if (!user)
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };

  const analytics = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/api/student/statistic`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    })
    .then((res) => {
      return res.data.result;
    })
    .catch((err) => {
      return null;
    });

  if (!analytics)
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };

  return { props: { user, analytics } };
}
