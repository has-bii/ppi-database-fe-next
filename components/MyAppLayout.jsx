import Head from "next/head";
import MyAppNav from "./MyAppNav";
import TopBar from "./TopBar";

export default function MyAppLayout({ children }) {
  return (
    <>
      <Head>
        <title>My App | PPI Karabük</title>
      </Head>
      <div className="relative flex flex-col w-screen h-screen gap-4 transition-colors duration-300 ease-in-out bg-primary dark:bg-dark-primary lg:p-2 lg:flex-row">
        <MyAppNav />
        <div className="flex flex-col w-full gap-4">
          <TopBar />
          <div className="w-full h-full overflow-auto rounded-xl">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
