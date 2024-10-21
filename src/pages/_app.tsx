import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{}}
      cookieDomain={process.env.NEXT_PUBLIC_CLERK_COOKIE_DOMAIN || undefined}
    >
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
