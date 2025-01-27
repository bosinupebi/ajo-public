import "./globals.css";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { cookieToInitialState } from "wagmi";
import { GetConfig } from "@/wagmi";
import { Providers } from "./providers";
import { FaGithub } from "react-icons/fa";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ajo Version 1 | Pool your crypto tokens ",
  description: "Created by ByteTrance",
  icons:"icon.jpg"
};



export default async function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    GetConfig(),
    (await headers()).get("cookie")
  );

  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col min-h-screen relative`}
      >
        <Providers initialState={initialState}>
          {/* App Content */}
          <div className="flex-grow">{props.children}</div>
        </Providers>
        {/* GitHub Link Component */}
        <footer className="fixed bottom-1 left-0 p-1 ">
          <a
            href="https://github.com/bosinupebi/ajo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
            aria-label="View source on GitHub"
          >
            <FaGithub size={24} />
          </a>
        </footer>
        <SpeedInsights /> 
        <Analytics/>
      </body>
    </html>
  );
}
