import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Decentralized Vault",
  description: "Split funds among multiple wallets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <div className="min-h-screen fixed -z-10 min-w-full bg-[url(https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover blur-sm"></div> */}
        <div className="min-h-screen fixed -z-10 min-w-full bg-gradient-to-r from-[#399ad5] to-[#2c2c6e]"></div>
        {children}
      </body>
    </html>
  );
}
