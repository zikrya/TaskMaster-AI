import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from '../components/navbar';
import { StickyProvider } from '../context/StickContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DevLiftoff",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/dev_icon.png" />
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <StickyProvider>  {/* Add this line */}
            <NavBar />
            {children}
          </StickyProvider>  {/* Add this line */}
        </ClerkProvider>
      </body>
    </html>
  );
}
