import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LocalProviders from "@/components/layout/LocalProviders";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CollabTask",
  description: "CollabTask es una plataforma colaborativa tipo Trello, diseñada para facilitar la gestión de tareas en equipos de trabajo organizados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LocalProviders>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}

          <Toaster closeButton />
        </body>
      </html >
    </LocalProviders>
  );
}
