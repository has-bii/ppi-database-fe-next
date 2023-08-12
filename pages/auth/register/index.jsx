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
import waButton from "@public/image/waButtonBig.png";
import AuthLayout from "@components/AuthLayout";
import { hasCookie } from "cookies-next";
import { useToastContext } from "@components/ToastContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Index() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setToastLoading, setToastFailed, setToastSuccess } =
    useToastContext();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "3",
  });
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
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const regex = /^[A-Za-z\s]*$/;
    if (form.name?.match(regex) || form.name.length === 0) {
      setNameValidation({ message: "", style: "", ok: true });
    } else {
      setNameValidation({
        message: "Contains alphabet only!",
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
    if (form.password.length === 0 || form.password.length > 7) {
      setPassValidation({ message: "", style: "", ok: true });
    } else {
      setPassValidation({
        message: "Password at least 8 characters",
        style: "text-red-500",
        ok: false,
      });
    }
  }, [form.password]);

  const openWaLink = (i) => {
    let link;
    let message;

    if (i === 2)
      link = `https://wa.me/${process.env.NEXT_PUBLIC_VERIFY_CONTACT}?`;
    else if (i === 3)
      link = `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_CONTACT}?`;

    if (i === "3")
      message = `text=Hi admin, Saya ${form.name} telah membuat akun di website PPI Karabük untuk "DAFTAR KULIAH" di Karabük University. Saya meminta untuk aktifkan akun saya.`;
    else if (i === "2")
      message = `text=Hi admin, Saya ${form.name} telah membuat akun di website PPI Karabük sebagai "ANGGOTA" di PPI Karabük. Saya meminta untuk aktifkan akun saya.`;

    message = encodeURI(message);

    const linkMessage = link.concat(message);

    window.open(linkMessage, "_blank");

    setToastLoading("Redirecting to Login page...");
    router.push("/auth");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setToastLoading();
    setLoading(true);

    if (!nameValidation.ok || !emailValidation.ok || !passValidation.ok) {
      setToastFailed("All fields are required!");
    } else {
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, form)
        .then((res) => {
          setToastSuccess(res.data.meta.message);

          setSubmitted(true);
        })
        .catch((error) => {
          setToastFailed(error?.response.data.meta.message);
          setLoading(false);
        });
    }
  };

  return (
    <AuthLayout>
      <div className="_card">
        {!submitted ? (
          <>
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
                    form.email
                      ? emailValidation.ok
                        ? "_success"
                        : "_error"
                      : ""
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
                    form.password
                      ? passValidation.ok
                        ? "_success"
                        : "_error"
                      : ""
                  }`}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
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
              <div className="_form-input">
                <label htmlFor="purpose" className="_label-input">
                  Tujuan
                </label>
                <select
                  id="purpose"
                  className="_input"
                  required
                  value={form.role_id}
                  onChange={(e) =>
                    setForm({ ...form, role_id: e.target.value })
                  }
                >
                  <option value="2">Anggota PPI Karabük</option>
                  <option value="3">Daftar kuliah</option>
                </select>
              </div>
              <Link href="/auth/forgot" className=" _link">
                Forgot password?
              </Link>
              <button
                type="submit"
                className="w-full mt-2 mb-4 _button"
                disabled={loading}
              >
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
          </>
        ) : (
          <div className="flex flex-col justify-center">
            <div className="mb-2 text-2xl font-bold text-center">
              Hi {form.name},
            </div>
            <div className="mb-4 text-center text-gray-500">
              Terima kasih sudah mendaftar, <br />
              kirim permintaan verifikasi ke admin lewat Whatsapp untuk
              mengaktifkan akun
            </div>
            <button
              className="mx-auto w-fit"
              onClick={() => openWaLink(form.role_id)}
            >
              <Image src={waButton} height="auto" width="200" alt="" priority />
            </button>
          </div>
        )}
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
