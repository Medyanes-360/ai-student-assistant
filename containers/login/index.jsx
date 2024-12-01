"use client";
import Loading from "@/components/loading";
import Image from "next/image";
import loginImage from "@/public/images/auth.webp";
import ConfirmSignout from "@/components/login/signOut";
import FormLoginWrapper from "@/components/login/formWrapper";
import { useSession } from "next-auth/react";

export default function Login() {
  const { status } = useSession();
  if (status === "loading") {
    return <Loading />;
  }

  return (
    <section className="flex h-screen">
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
        <div className="max-w-md text-center">
          <Image
            src={loginImage}
            alt="Login"
            loading="lazy"
            width={500}
            height={1080}
            placeholder="empty"
            onLoadingComplete={(img) => console.log(img.naturalWidth)}
          />
        </div>
      </div>
      <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
        {status === "authenticated" ? <ConfirmSignout /> : <FormLoginWrapper />}
      </div>
    </section>
  );
}
