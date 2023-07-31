import "@styles/globals.css";
import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import ToastProvider from "@components/ToastProvider";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PPI Karabuk",
};

export default function MyApp({ Component, pageProps }) {
  return (
    <main>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </main>
  );
}
