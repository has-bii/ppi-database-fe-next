"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import Validation from "@components/Validation";
import Alert from "@components/Alert";
import AuthLayout from "@components/AuthLayout";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie, getCookies, hasCookie, setCookie } from "cookies-next";

export default function page() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", pass: "" });
  const [alert, setAlert] = useState({});
  const [emailValidation, setEmailValidation] = useState({
    message: "",
    style: "",
    ok: true,
  });
  const [passValidation, setPassValidation] = useState({
    message: "",
    style: "",
    ok: true,
  });

  useEffect(() => {
    setEmailValidation({ message: "", style: "", ok: true });
    setPassValidation({ message: "", style: "", ok: true });
  }, [form]);

  const formHandler = async (e) => {
    e.preventDefault();

    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        email: form.email,
        password: form.pass,
      })
      .then((res) => {
        addAlert("Login successful", true);

        setCookie("user_token", res.data.result.access_token, {
          path: "/",
          maxAge: 60 * 6 * 24,
        });

        router.push("/my-app");
      })
      .catch((err) => {
        addAlert(err.response.data.meta.message, false);
        setEmailValidation({
          message: "",
          style: "",
          ok: false,
        });
        setPassValidation({
          message: "",
          style: "",
          ok: false,
        });
      });
  };

  const addAlert = (message, status) => {
    setAlert({ message: message, status: status });
  };

  return (
    <AuthLayout>
      <Alert alert={alert} setAlert={setAlert} />
      <div className="_card">
        <div className="text-2xl font-bold text-center">Login</div>
        <form onSubmit={formHandler}>
          <div className="_form-input">
            <label htmlFor="email" className="_label-input">
              email
            </label>
            <input
              type="email"
              className={`_input ${emailValidation.ok ? "" : "_error"}`}
              id="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Validation
              message={emailValidation.message}
              style={emailValidation.style}
            />
          </div>
          <div className="_form-input">
            <label htmlFor="password" className="_label-input">
              password
            </label>
            <input
              type={showPass ? "text" : "password"}
              className={`_input ${passValidation.ok ? "" : "_error"}`}
              id="password"
              placeholder="Enter password"
              value={form.pass}
              onChange={(e) => setForm({ ...form, pass: e.target.value })}
              required
            />
            <FontAwesomeIcon
              icon={showPass ? faEyeSlash : faEye}
              className="_input_icon"
              onClick={() => setShowPass(!showPass)}
            />
            <Validation
              message={passValidation.message}
              style={passValidation.style}
            />
          </div>
          <Link href="/auth/forgot" className=" _link">
            Forgot password
          </Link>
          <button type="submit" className="w-full mt-2 mb-4 _button">
            <FontAwesomeIcon icon={faArrowRightToBracket} />
            Login
          </button>
          <div className="text-sm text-center text-gray-400">
            Don't have an account?
          </div>
          <div className="flex justify-center w-full">
            <Link href="/auth/register" className="text-center _link">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export async function getServerSideProps({ req, res }) {
  const cookie = hasCookie("user_token", { req, res });

  if (cookie) {
    return {
      redirect: {
        destination: "/my-app",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
