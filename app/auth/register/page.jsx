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

  useEffect(() => {
    const regex = /^[A-Za-z\s]*$/;
    if (form.name?.match(regex)) {
      setNameValidation({ message: "", style: "", ok: true });
    } else {
      setNameValidation({
        message: "Contains characters only!",
        style: "text-red-500",
        ok: false,
      });
    }
  }, [form.name]);

  useEffect(() => {}, [form.email]);

  return (
    <div className="_card">
      <div className="text-2xl font-bold text-center">Register</div>
      <form>
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
            className="_input"
            id="email"
            placeholder="Enter email address"
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
            placeholder="At least 8 characters"
            required
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
  );
}
