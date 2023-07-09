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
import axios from "axios";
import Alert from "@components/Alert";
import { useRouter } from "next/navigation";

export default function page() {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", pass: "" });
  const [nameValidation, setNameValidation] = useState({
    message: "",
    style: "",
    ok: false,
  });
  const [emailValidation, setEmailValidation] = useState({
    message: "",
    style: "",
    ok: false,
  });
  const [passValidation, setPassValidation] = useState({
    message: "",
    style: "",
    ok: false,
  });
  const [alert, setAlert] = useState({});
  const router = useRouter();

  useEffect(() => {
    const regex = /^[A-Za-z\s]*$/;
    if (form.name?.match(regex) || form.name.length === 0) {
      setNameValidation({ message: "", style: "", ok: true });
    } else {
      setNameValidation({
        message: "Contains characters only!",
        style: "text-red-500",
        ok: false,
      });
    }
  }, [form.name]);

  useEffect(() => {
    const emailRegex = new RegExp(/^[A-Za-z0-9_.]+\@[a-z]+.[a-z.]+$/, "gm");

    if (form.email?.match(emailRegex) || form.email.length === 0) {
      setEmailValidation({ message: "", style: "", ok: true });
    } else {
      setEmailValidation({
        message: "Invalid email!",
        style: "text-red-500",
        ok: false,
      });
    }
  }, [form.email]);

  useEffect(() => {
    if (form.pass.length === 0 || form.pass.length > 7) {
      setPassValidation({ message: "", style: "", ok: true });
    } else {
      setPassValidation({
        message: "Password at least 8 characters",
        style: "text-red-500",
        ok: false,
      });
    }
  }, [form.pass]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!nameValidation.ok || !emailValidation.ok || !passValidation.ok) {
      addAlert("All fields are required!");
    } else {
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
          name: form.name,
          email: form.email,
          password: form.pass,
        })
        .then((res) => {
          addAlert(res.data.meta.message, true);
          setForm({ name: "", email: "", pass: "" });

          const t = setTimeout(() => router.push("/auth"), 3000);
        })
        .catch((error) => {
          const { message } = error.response.data.meta;
          addAlert(message, false);
        });
    }
  };

  const addAlert = (message, status) => {
    setAlert({ message: message, status: status });
  };
  const clearAlert = () => {
    setAlert({});
  };

  return (
    <>
      <Alert alert={alert} clearAlert={clearAlert} />
      <div className="_card">
        <div className="text-2xl font-bold text-center">Register</div>
        <form onSubmit={submitHandler}>
          <div className="_form-input">
            <label htmlFor="name" className="_label-input">
              name
            </label>
            <input
              type="text"
              className={`_input ${
                form.name ? (nameValidation.ok ? "_success" : "_error") : ""
              }`}
              id="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Validation
              message={nameValidation.message}
              style={nameValidation.style}
            />
          </div>
          <div className="_form-input">
            <label htmlFor="email" className="_label-input">
              email
            </label>
            <input
              type="email"
              className={`_input ${
                form.email ? (emailValidation.ok ? "_success" : "_error") : ""
              }`}
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
              id="password"
              placeholder="At least 8 characters"
              className={`_input ${
                form.pass ? (passValidation.ok ? "_success" : "_error") : ""
              }`}
              value={form.pass}
              onChange={(e) => setForm({ ...form, pass: e.target.value })}
              required
            />
            <Validation
              message={passValidation.message}
              style={passValidation.style}
            />
            <FontAwesomeIcon
              icon={showPass ? faEyeSlash : faEye}
              className="_input_icon"
              onClick={() => setShowPass(!showPass)}
            />
          </div>
          <Link href="/auth/forgot" className=" _link">
            Forgot password?
          </Link>
          <button type="submit" className="mt-2 mb-4 _button">
            <FontAwesomeIcon icon={faArrowRightToBracket} />
            Register
          </button>
          <div className="text-sm text-center text-gray-400">
            Already have an account?
          </div>
          <div className="flex justify-center w-full">
            <Link href="/auth" className="_link">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
