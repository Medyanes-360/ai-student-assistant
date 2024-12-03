"use client"
import Header from "@/components/layout/header";
import { usePathname } from "next/navigation";


export default function HomeLayout({ children }) {
  const pathname = usePathname();

  return (
    <>
      {/* {pathname !== "/" && <Header />} */}
      <Header />
      {children}
    </>
  );
}
