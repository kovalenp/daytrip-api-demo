import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { Theme } from "@radix-ui/themes";
import { QueryClient } from "@tanstack/react-query";
import IconSprite from "@/components/IconSprite";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Daytrip | Partners API Demo",
};

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="robots" content="noindex" />
      <body className={`${inter.className}`}>
        <Providers>
          <Theme className="bg-gray-100">{children}</Theme>
          <IconSprite />
        </Providers>
      </body>
    </html>
  );
}
