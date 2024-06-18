import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Decentralized Vault",
  description: "Split funds among multiple wallets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen fixed -z-10 min-w-full bg-gradient-to-r from-[#399ad5] to-[#2c2c6e] dark:from-[#05091ead] dark:to-[#05091eb7]"></div>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
