import MyNavbar from "@components/MyNavbar";
import UserDashboard from "@components/UserDashboard";
import { isAdmin } from "@lib/isAdmin";
import axios from "axios";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import Head from "next/head";

export default function index({ user }) {
  const users = [
    {
      name: "Hasbiy Robbiy",
      email: "hasbiy.rofficial@gmail.com",
      role: "Admin",
      status: 1,
      created_at: "2023-07-12 13:20:00",
    },
    {
      name: "Hasbiy Robbiy",
      email: "hasbiy.rofficial@gmail.com",
      role: "Admin",
      status: 0,
      created_at: "2023-07-12 13:20:00",
    },
    {
      name: "Hasbiy Robbiy",
      email: "hasbiy.rofficial@gmail.com",
      role: "Admin",
      status: 1,
      created_at: "2023-07-12 13:20:00",
    },
    {
      name: "Hasbiy Robbiy",
      email: "hasbiy.rofficial@gmail.com",
      role: "Admin",
      status: 1,
      created_at: "2023-07-12 13:20:00",
    },
    {
      name: "Hasbiy Robbiy",
      email: "hasbiy.rofficial@gmail.com",
      role: "Admin",
      status: 1,
      created_at: "2023-07-12 13:20:00",
    },
    {
      name: "Hasbiy Robbiy",
      email: "hasbiy.rofficial@gmail.com",
      role: "Admin",
      status: 1,
      created_at: "2023-07-12 13:20:00",
    },
    {
      name: "Hasbiy Robbiy",
      email: "hasbiy.rofficial@gmail.com",
      role: "Admin",
      status: 1,
      created_at: "2023-07-12 13:20:00",
    },
    {
      name: "Hasbiy Robbiy",
      email: "hasbiy.rofficial@gmail.com",
      role: "Admin",
      status: 1,
      created_at: "2023-07-12 13:20:00",
    },
    {
      name: "Hasbiy Robbiy",
      email: "hasbiy.rofficial@gmail.com",
      role: "Admin",
      status: 1,
      created_at: "2023-07-12 13:20:00",
    },
    {
      name: "Hasbiy Robbiy",
      email: "hasbiy.rofficial@gmail.com",
      role: "Admin",
      status: 1,
      created_at: "2023-07-12 13:20:00",
    },
  ];

  const formatDate = (timestamp) => {
    const d = new Date(timestamp);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Des",
    ];

    const date = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();

    const time = `${date}-${months[month]}-${year}`;

    return time;
  };

  return (
    <div className="bg-base-grey">
      <Head>
        <title>My App | PPI Karabük</title>
      </Head>
      <div className="flex flex-col w-screen h-screen overflow-hidden lg:flex-row">
        <MyNavbar role_id={user.role_id} />
        <div className="flex flex-col w-full gap-4 p-4">
          <UserDashboard pageName="Users" user={user} />
          <div className="w-full h-full gap-2 _card_myapp ">
            {/* Contents */}

            <div className="_filters"></div>
            <div className="overflow-hidden border border-black rounded-lg ">
              <table className="table-auto">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col">Enrolled</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        {u.status ? (
                          <span className="_pill _success">Verified</span>
                        ) : (
                          <span className="_pill _error">Unverified</span>
                        )}
                      </td>
                      <td>{formatDate(u.created_at)}</td>
                      <td>Verify | Delete | Role</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="_pagination">
                <button className="_pagination_button">Prev</button>
                <div className="text-gray-500 ">Page 1 of 10</div>
                <button className="_pagination_button">Next</button>
              </div>
            </div>
          </div>
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

  const user = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    })
    .then((res) => {
      return res.data.result;
    })
    .catch((err) => {
      deleteCookie("user_token", { req, res });
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    });

  if (!isAdmin(user))
    return {
      redirect: {
        destination: "/my-app",
        permanent: false,
      },
    };

  return { props: { user } };
}
