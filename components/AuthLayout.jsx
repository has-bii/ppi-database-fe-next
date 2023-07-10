import Head from "next/head";
import React from "react";

export default function AuthLayout({ children }) {
  return (
    <>
      <Head>
        <title>Auth | PPI Karabük</title>
      </Head>
      <div className="flex items-center justify-center w-screen h-screen">
        {children}
      </div>
    </>
  );
}
