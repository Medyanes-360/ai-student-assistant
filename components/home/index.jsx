"use client";
import Link from "next/link";
import NextButton from "@/globalElements/Button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
export default function HomePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  if (!status || status === "loading") {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-900">
        <p className="text-lg text-white animate-pulse">Loading...</p>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-violet-900 to-violet-600">
        <div className="grid md:grid-cols-3 gap-4 md:gap-10 w-full h-full justify-center items-center max-w-7xl">
          <div className="aspect-square gap-6 flex flex-col justify-center items-center">
            <p className="text-white text-3xl md:text-5xl">Games</p>
            <Link href="/games">
              <NextButton className=" aspect-square bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-lg text-lg hover:scale-110 hover:-translate-y-2 transition-all duration-200 ease-in-out">
                <FaArrowRight fontSize={32} />
              </NextButton>
            </Link>
          </div>
          <div className="aspect-square gap-6 flex flex-col justify-center items-center">
            <p className="text-white text-3xl md:text-5xl">SpeakBuddy</p>
            <Link href="/chat">
              <NextButton className=" aspect-square bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg text-lg hover:scale-110 hover:-translate-y-2 transition-all duration-200 ease-in-out">
                <FaArrowRight fontSize={32} />
              </NextButton>
            </Link>
          </div>
          <div className="aspect-square gap-6 flex flex-col justify-center items-center">
            <p className="text-white text-3xl md:text-5xl">Learn</p>
            <Link href="/learn">
              <NextButton className=" aspect-square bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg text-lg hover:scale-110 hover:-translate-y-2 transition-all duration-200 ease-in-out">
                <FaArrowRight fontSize={32} />
              </NextButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-900 to-violet-600 flex flex-col sm:flex-row justify-center items-center">
      <div className="container flex flex-wrap items-center justify-between">
        {/* Sol Sütun */}
        <div className="w-full sm:w-1/2 px-4 mb-8 sm:mb-0">
          <h1 className="text-4xl font-extrabold text-gray-100 mb-4">
            Best Kids Online Learning Platform , SpeakBuddy! 🎙️
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            We offer a conversational interactive experience to enhance
            children's imagination and learning!
          </p>
          <div className="flex space-x-4">
            <Link href="/login">
              <NextButton className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-lg text-sm sm:text-base transition duration-150 ease-in-out">
                Sign In
              </NextButton>
            </Link>
            <Link href="/register">
              <NextButton className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg text-sm sm:text-base transition duration-150 ease-in-out">
                Sign Up
              </NextButton>
            </Link>
          </div>
        </div>

        {/* Sağ Sütun */}
        <div className="w-full h-full flex justify-center items-center aspect-square sm:w-1/2 px-4 bg-contain bg-[url('/images/blob.svg')]">
          <Image
            src="/images/ai-child.png"
            alt="Image of a kid learning"
            width={400}
            height={400}
            className="max-w-xs lg:max-w-full"
          />
        </div>
      </div>
    </div>

    // <div className="bg-gradient-to-r from-blue-300 to-purple-300 min-h-screen flex items-center justify-center">
    //   <header className="w-full max-w-5xl mx-auto text-center">
    //     <div className="relative bg-white shadow-lg rounded-xl overflow-hidden">
    //       {/* Hero Image */}
    //       <div className="absolute inset-0 -z-10">
    //         <Image
    //           src="/images/ai.jpeg"
    //           alt="Child learning with AI"
    //           layout="fill"
    //           objectFit="cover"
    //           className="opacity-30"
    //           priority
    //         />
    //       </div>

    //       {/* Content */}
    //       <div className="p-8 md:p-12">
    //         <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 animate-bounce">
    //           SpeakBuddy'e Hoşgeldiniz! 🎙️
    //         </h1>
    //         <p className="text-lg md:text-xl text-gray-700 mb-8">
    //           Çocukların hayal gücünü ve öğrenimini artırmak için konuşarak
    //           etkileşimli bir deneyim sunuyoruz!
    //         </p>

    //         {/* Buttons */}
    //         <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
    //           <button className="px-8 py-4 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out transform hover:scale-105">
    //             Giriş Yap
    //           </button>
    //           <button className="px-8 py-4 text-white bg-purple-500 rounded-lg shadow-lg hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300 ease-in-out transform hover:scale-105">
    //             Kayıt Ol
    //           </button>
    //         </div>
    //       </div>

    //       {/* Animated Element */}
    //       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-pulse">
    //         <div className="text-2xl text-gray-700 bg-white rounded-full px-4 py-2 shadow-lg">
    //           🎧 Mikrofona Bas ve Konuş!
    //         </div>
    //       </div>
    //     </div>
    //   </header>
    // </div>
  );
  // <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
  //   <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center hover:text-indigo-500 transition-colors duration-200">
  //     SpeakBuddy&apos;ye Hoşgeldiniz
  //   </h1>
  //   <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
  //     <Link href="/login">
  //       <NextButton className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-lg text-sm sm:text-base transition duration-150 ease-in-out">
  //         Giriş Yap
  //       </NextButton>
  //     </Link>
  //     <Link href="/register">
  //       <NextButton className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg text-sm sm:text-base transition duration-150 ease-in-out">
  //         Kayıt Ol
  //       </NextButton>
  //     </Link>
  //   </div>
  // </div>
}
