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

export default function page() {
  const [showPass, setShowPass] = useState(false);
  const [validationProp, setValidationProp] = useState({
    message: "",
    style: "text-red-500",
  });
  const [form, setForm] = useState({ email: "", pass: "" });

  const formHandler = (e) => {
    e.preventDefault();

    if (form.pass.length < 8)
      setValidationProp({
        ...validationProp,
        message: "Pass at least 8 characters!",
      });
    else setValidationProp({ ...validationProp, message: "" });
  };

  useEffect(() => {
    if (form.pass.length === 0)
      setValidationProp({ ...validationProp, message: "" });
  }, [form.pass]);

  return (
    <div className="_card">
      <div className="text-2xl font-bold text-center">Login</div>
      <form onSubmit={formHandler}>
        <div className="_form-input">
          <label htmlFor="email" className="_label-input">
            email
          </label>
          <input
            type="email"
            className="_input"
            id="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="_form-input">
          <label htmlFor="password" className="_label-input">
            password
          </label>
          <input
            type={showPass ? "text" : "password"}
            className="_input"
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
            message={validationProp.message}
            style={validationProp.style}
          />
        </div>
        <Link href="/auth/forgot" className=" _link">
          Forgot password
        </Link>
        <button type="submit" className="mt-2 mb-4 _button">
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
  );
}
