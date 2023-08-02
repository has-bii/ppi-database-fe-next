import axios from "axios";
import { getCookie, hasCookie } from "cookies-next";

export async function deleteData(url, data) {
  if (!url) return null;

  let cookie = hasCookie("user_token");

  if (!cookie) return null;

  cookie = getCookie("user_token");

  const res = await axios
    .delete(`${process.env.NEXT_PUBLIC_API_URL}/api${url}`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
      data: data,
    })
    .then((res) => {
      return res.data?.meta?.message;
    })
    .catch((err) => {
      return null;
    });

  return res;
}
