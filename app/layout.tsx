import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Legal AI Lab - Co-building Legal AI Factories",
  description:
    "Infrastructure for legal cognition. Join 10 visionary law firms building the future of legal operations.",
  keywords:
    "legal AI, law firms, legal tech, AI factories, legal infrastructure",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark:[color-scheme:dark]"
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#0A0A23",
                color: "#fff",
                padding: "16px",
                borderRadius: "8px",
              },
              success: {
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#fff",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
