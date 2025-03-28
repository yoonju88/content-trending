import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NavBar from "@/components/nav/Nav";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800']
});

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
      <body className={`${poppins.className}`}>
        <Providers>
          <NavBar />
          <main className='container py-10'>
            {children}
          </main>
          <footer>
            
          </footer>
        </Providers>
      </body>
    </html>
  );
}
