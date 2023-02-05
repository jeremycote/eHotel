import "@/src/styles/globals.css";
import "@/src/styles/grids.css";
import "@/src/styles/utils.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
