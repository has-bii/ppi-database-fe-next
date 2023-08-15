import axios from "axios";
import { getCookie } from "cookies-next";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + getCookie("user_token"),
  },
});

export default instance;
