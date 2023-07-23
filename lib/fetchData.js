import axios from "axios";
import { getCookie, hasCookie, setCookie } from "cookies-next";

export async function fetchData(url, req, res, params = {}) {
  let cookie = hasCookie("user_token", { req, res });

  if (!cookie) return null;

  cookie = getCookie("user_token", { req, res });
  setCookie("user_token", cookie, { req, res, maxAge: 60 * 6 * 24 * 24 });

  const data = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/api${url}`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
      params: params,
    })
    .then((res) => {
      return res.data.result;
    })
    .catch((err) => {
      console.log(err.response);
      return null;
    });

  return data;
}
