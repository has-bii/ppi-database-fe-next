import axios from "axios";
import { getCookie, hasCookie } from "cookies-next";

export async function getNavbarData({ req, res }) {
  let cookie = hasCookie("user_token", { req, res });

  if (!cookie) return null;

  cookie = getCookie("user_token", { req, res });

  const data = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/api/my-menu`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    })
    .then((res) => {
      return res.data.result.menu;
    })
    .catch((err) => {
      return null;
    });

  return data;
}
