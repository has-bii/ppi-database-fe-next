import axios from "axios";
import { getCookie, hasCookie } from "cookies-next";

export async function sendData(url, data) {
  if (!url) return null;

  let cookie = hasCookie("user_token");

  if (!cookie) return null;

  cookie = getCookie("user_token");

  const res = await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/api${url}`, data, {
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

  return res;
}
