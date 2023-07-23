import axios from "axios";
import { getCookie, hasCookie, setCookie } from "cookies-next";

export async function fetchUser(req, res) {
  let cookie = hasCookie("user_token", { req, res });

  if (!cookie) return null;

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

  return user;
}
