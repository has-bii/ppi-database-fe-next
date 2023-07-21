import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/icon/icon.png" />
      </Head>
      <body className="_hide_scrollbar">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
