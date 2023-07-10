import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>PPI Karabük</title>
      </Head>
      {children}
    </>
  );
}
