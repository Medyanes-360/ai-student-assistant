import Button from "@/globalElements/Button";
import { signOut } from "next-auth/react";
import React from "react";

const ConfirmSignout = () => {
  return (
    <div className="max-w-md w-full p-6">
      <h1 className="text-3xl font-semibold mb-6 text-black text-center">
        Sizin hesabiniz var lutfen cikis yapin
      </h1>

      <div>
        <Button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="h-12 flex items-center justify-center rounded-md bg-red-400 text-white w-full"
        >
          Çıkış yap
        </Button>
      </div>
    </div>
  );
};

export default ConfirmSignout;
