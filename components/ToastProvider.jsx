import { ToastContext } from "@components/ToastContext";
import { useState } from "react";
import Toast from "./Toast";

export default function ToastProvider({ children }) {
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
      <Toast toastData={toastData} setToastData={setToastData} />
      {children}
    </ToastContext.Provider>
  );
}
