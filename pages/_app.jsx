import "@styles/globals.css";
import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Toast from "@components/Toast";
import { useState } from "react";
import { ToastContext } from "./ToastContext";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PPI Karabuk",
};

export default function MyApp({ Component, pageProps }) {
  const [toastData, setToastData] = useState([]);

  const setToastLoading = (body = "Sending data to the server") => {
    setToastData((prev) => [...prev, { title: "Loading", body: body }]);
  };

  const setToastSuccess = (body = "Success") => {
    setToastData((prev) => [
      ...prev,
      { title: "Success", body: body, style: "_success" },
    ]);
  };

  const setToastFailed = (body = "Server Error occurred!") => {
    setToastData((prev) => [
      ...prev,
      { title: "Error", body: body, style: "_danger" },
    ]);
  };

  return (
    <ToastContext.Provider
      value={{ setToastData, setToastLoading, setToastSuccess, setToastFailed }}
    >
      <main>
        <Toast toastData={toastData} setToastData={setToastData} />
        <Component {...pageProps} />
      </main>
    </ToastContext.Provider>
  );
}
