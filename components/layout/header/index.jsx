"use client";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import NextButton from "@/globalElements/Button";
import { IoSettings } from "react-icons/io5";
import React, { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import useConversationStore from "@/zustand/conversationStore";

export default function Header() {
  // const conversations = useConversationStore((state) => state.conversations);
  // const getConversations = useConversationStore(
  //   (state) => state.getConversations
  // );
  // const createConversation = useConversationStore(
  //   (state) => state.createConversation
  // );

  const [open, setOpen] = useState(false);
  const { status, data } = useSession();
  const openRef = useRef();
  const pathname = usePathname();

  const handleClickOutside = React.useCallback((event) => {
    if (openRef.current && !openRef.current.contains(event.target)) {
      setOpen(false);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // const handleGetConversations = async () => {
  //   await getConversations();
  // };
  // console.log(conversations);

  return (
    <header className="border-b min-h-[80px] flex items-center  p-4 bg-gray-800 text-white dark:bg-gray-900 dark:text-gray-100 fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center ">
        <h1 className="text-xl font-bold hover:text-indigo-400 transition-colors duration-200">
          <Link href="/">SpeakBuddy</Link>
        </h1>
        {/* <button onClick={handleGetConversations}>Click to fetch</button> */}
        <div className="flex items-center space-x-4">
          {/* Yanlış link grubunu göstermemesi için Auth state'i bekler */}
          {status === "loading" ? (
            <div></div>
          ) : status === "authenticated" ? (
            <div className="flex items-center space-x-4">
              {/* Pathname'e göre linki dinamik olarak değiştirir */}
              {pathname === "/chat" ? (
                <Link href="/chat-history">
                  <NextButton className="text-sm sm:text-base bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out">
                    Chat History
                  </NextButton>
                </Link>
              ) : (
                <Link href="/chat">
                  <NextButton className="text-sm sm:text-base bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out">
                    Chat
                  </NextButton>
                </Link>
              )}
              <div className="relative flex items-center" ref={openRef}>
                <button className="text-2xl" onClick={() => setOpen(!open)}>
                  <IoSettings />
                </button>
                {open && (
                  <div className="absolute mt-5 top-5 right-0 flex flex-col border transition-all bg-white max-w-fit rounded-md shadow-sm text-center">
                    <Link
                      href={"/dashboard"}
                      className="text-black whitespace-nowrap text-base border-bp-2 hover:bg-red-50 transition-all duration-300 block w-full h-full p-3  border-b border-black/20"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="text-black whitespace-nowrap text-base border-bp-2 hover:bg-red-50 transition-all duration-300 block w-full h-full p-3  "
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
                  Sign In{" "}
                </NextButton>
              </Link>
              <Link href="/register">
                <NextButton className="text-sm sm:text-base bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-150 ease-in-out">
                  Sign Up{" "}
                </NextButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
