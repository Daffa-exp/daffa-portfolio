import type { Metadata } from "next";
import type { ReactNode } from "react";
import StudioClientShell from "./StudioClientShell";

export const metadata: Metadata = {
  title: "Daffa Studio — Private Control Center",
  description: "Private CMS and Portfolio Copilot environment.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <StudioClientShell>{children}</StudioClientShell>;
}
