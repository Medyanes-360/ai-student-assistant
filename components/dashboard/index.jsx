"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import LanguageDevelopment from "@/components/dashboard/languageDevelopment";

const Dashboard = ({ status }) => {
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  if (status === "loading") {
    return <Loading />;
  }
  return (
    <div className="container mx-auto py-10">
      <LanguageDevelopment />
    </div>
  );
};

// Bileşeni dinamik olarak yükleyip yalnızca istemci tarafında render edilmesini sağlıyoruz
export default dynamic(() => Promise.resolve(Dashboard), {
  ssr: false,
});
