"use client";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import NextButton from "@/globalElements/Button";
import { IoSettings } from "react-icons/io5";
import React, { useRef, useState } from "react";

export default function Header() {
  const { status, data } = useSession();
  const [open, setOpen] = useState(false);
  const openRef = useRef();

  const handleClickOutside = React.useCallback((event) => {
    if (openRef.current && !openRef.current.contains(event.target)) {
      console.log("Clicked outside!");
      setOpen(false);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <header className="border-b min-h-[80px] flex items-center  p-4 bg-gray-800 text-white dark:bg-gray-900 dark:text-gray-100">
      <div className="container mx-auto flex justify-between items-center ">
        <h1 className="text-xl font-bold hover:text-indigo-400 transition-colors duration-200">
          <Link href="/">SpeakBuddy</Link>
        </h1>
        <div className="flex items-center space-x-4">
          {status === "authenticated" ? (
            <div className="flex items-center space-x-4">
              <Link href="/history">
                <NextButton className="text-sm sm:text-base bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out">
                  Chat History
                </NextButton>
              </Link>
              <div className="relative flex items-center" ref={openRef}>
                <button className="text-2xl" onClick={() => setOpen(!open)}>
                  <IoSettings />
                </button>
                {open && (
                  <div className="absolute mt-5 top-5 right-0 flex flex-col border transition-all bg-white max-w-fit rounded-md shadow-sm">
                    {/* <span className="text-black whitespace-nowrap text-base border-b border-solid border-blue-100 p-2 block">
                      Hoş geldin <b>{data.user.name}</b>
                    </span> */}
                    <Link
                      href={"/"}
                      className="text-black whitespace-nowrap text-base border-bp-2 hover:bg-red-50 transition-all duration-300 block w-full h-full p-3  text-start"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="text-black whitespace-nowrap text-base border-bp-2 hover:bg-red-50 transition-all duration-300 block w-full h-full p-3  text-start"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <NextButton className="text-sm sm:text-base bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out">
                  Giriş Yap
                </NextButton>
              </Link>
              <Link href="/register">
                <NextButton className="text-sm sm:text-base bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out">
                  Kayıt Ol
                </NextButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
