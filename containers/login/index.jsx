import Image from "next/image";
import loginImage from "@/public/images/auth.webp";
import FormLoginWrapper from "@/components/login/formWrapper";

export default function Login() {
  return (
    <section className="flex h-screen">
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
        <div className="max-w-md text-center">
          <Image
            src={loginImage}
            alt="Login"
            loading="lazy"
            width={1920}
            height={1080}
            placeholder="empty"
          />
        </div>
      </div>
      <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
        <FormLoginWrapper />
      </div>
    </section>
  );
}
