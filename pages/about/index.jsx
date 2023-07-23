import Layout from "@components/Layout";
import Head from "next/head";
import React from "react";

export default function index() {
  return (
    <Layout>
      <Head>
        <title>About | PPI Karabük</title>
      </Head>
      <div className="flex items-center justify-center w-full h-[calc(100vh-84px)] bg-white">
        <h1 className="text-6xl font-bold">We are working on this page.</h1>
      </div>
    </Layout>
  );
}
