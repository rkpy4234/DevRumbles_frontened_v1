import type { Metadata } from "next";

import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <body className="bg-gray-300">{children}</body>
      </GoogleOAuthProvider>
    </html>
  );
}
