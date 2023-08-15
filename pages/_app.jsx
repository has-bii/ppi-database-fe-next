import "@styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import ToastProvider from "@components/ToastProvider";
import { UserProvider } from "@components/UserProvider";
import { MyNavProvider } from "@components/MyNavContext";
import ThemeProvider from "@components/ThemeProvider";
config.autoAddCss = false;

export const metadata = {
  title: "PPI Karabuk",
};

export default function MyApp({ Component, pageProps }) {
  return (
    <main>
      <ThemeProvider>
        <UserProvider>
          <MyNavProvider>
            <ToastProvider>
              <Component {...pageProps} />
            </ToastProvider>
          </MyNavProvider>
        </UserProvider>
      </ThemeProvider>
    </main>
  );
}
