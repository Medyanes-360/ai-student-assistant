import Button from "@/globalElements/Button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

const ConfirmSignout = () => {
  return (
    <div className="max-w-md w-full p-6">
      <h1 className="text-3xl font-semibold mb-6 text-black text-center">
        Zaten giriş yaptınız, lütfen çıkış yapın.
      </h1>

      <div className="flex flex-col gap-y-3 justify-center w-full items-center">
        <Button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="h-12 flex items-center justify-center rounded-md bg-red-400 text-white w-full"
        >
          Çıkış yap
        </Button>
        <Link href="/" className="w-full text-center text-green-700">
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
};

export default ConfirmSignout;
