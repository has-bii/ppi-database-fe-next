import Head from "next/head";
import MyAppNav from "./MyAppNav";
import TopBar from "./TopBar";

export default function MyAppLayout({ children }) {
  return (
    <>
      <Head>
        <title>My App | PPI Karabük</title>
      </Head>
      <div className="relative flex flex-col w-screen h-screen gap-4 bg-primary dark:bg-dark-primary lg:p-4 lg:flex-row">
        <MyAppNav />
        <div className="flex flex-col w-full gap-4 px-4">
          <TopBar />
          <div className="w-full h-full overflow-auto">{children}</div>
        </div>
      </div>
    </>
  );
}
