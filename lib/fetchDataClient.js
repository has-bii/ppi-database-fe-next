import axios from "axios";
import { getCookie, hasCookie } from "cookies-next";

export async function fetchDataClient(url, params = {}) {
  let cookie = hasCookie("user_token");

  if (!cookie) return null;

  cookie = getCookie("user_token");

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
      return null;
    });

  return data;
}
