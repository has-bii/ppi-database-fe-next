"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState, useEffect } from "react";
import Validation from "@components/Validation";
import Alert from "@components/Alert";
import AuthLayout from "@components/AuthLayout";

export default function page() {
  const [form, setForm] = useState({ email: "" });
  const [alert, setAlert] = useState({});
  const [emailValidation, setEmailValidation] = useState({
    message: "",
    style: "",
    ok: false,
  });

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

  const addAlert = (message, status) => {
    setAlert({ message: message, status: status });
  };
  const clearAlert = () => {
    setAlert({});
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!emailValidation.ok) return;

    addAlert("This feature is not available yet!", false);
  };

  return (
    <AuthLayout>
      <Alert alert={alert} clearAlert={clearAlert} />
      <div className="_card">
        <div className="mb-4 text-2xl font-bold text-center">
          Forgot Password?
        </div>
        <form onSubmit={submitHandler}>
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
          <button type="submit" className="w-full mt-2 mb-4 _button">
            <FontAwesomeIcon icon={faArrowRightToBracket} />
            Reset password
          </button>
          <div className="text-sm text-center text-gray-400">
            Already have an account?
          </div>
          <div className="flex justify-center w-full">
            <Link href="/auth" className="text-center _link">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
