import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from '../components/navbar'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TaskMaster-AI",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Include meta tags, title, and other head elements here */}
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <NavBar /> {/* Add the NavBar component here */}
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
