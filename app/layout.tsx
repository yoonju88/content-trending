import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NavBar from "@/components/nav/Nav";
import { AuthProvider } from "@/context/auth";


const inter = Inter({ subsets: ["latin"], });

export const metadata: Metadata = {
  title: "Create our Content trending!! ",
  description: "Generate the data for all about the trending content in the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Providers>
          <AuthProvider>
            <NavBar />
            <main className='container mx-auto min-h-screen relative p-24 flex items-center justify-center'>
              {children}
            </main>
            <footer className="container mx-auto text-center mt-20 bg-amber-100 p-10">
              <p>© 2024 쇼핑몰 주문서 관리 시스템</p>
            </footer>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
