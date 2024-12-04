"use client";
import React, { useState } from "react";
import Button from "@/globalElements/Button";
import Input from "@/globalElements/Input";
import Label from "@/globalElements/Label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa6";
import { signIn, useSession } from "next-auth/react";
import ConfirmSignout from "../signOut";

const FormLoginWrapper = () => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loginFields, setLoginStates] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginStates({ ...loginFields, [name]: value });
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { email, password } = loginFields;
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result.ok) {
        setLoginStates({
          email: "",
          password: "",
        });
        router.push("/");
        setSuccess("Giriş başarılı");
      } else {
        setError("Wrong Cridentials");
      }
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <FaSpinner className="animate-spin" />;
  } else if (status === "authenticated") {
    return <ConfirmSignout />;
  }

  return (
    <div className="max-w-md w-full p-6">
      <h1 className="text-3xl font-semibold mb-6 text-black text-center">
        Sign In
      </h1>
      <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
        Sign Our AI Consultation and Use It
      </h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={loginFields.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={loginFields.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Button
            disabled={loading}
            type="submit"
            className={`w-full flex  items-center justify-center text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 ${
              loading
                ? "cursor-not-allowed bg-gray-400"
                : "cursor-pointer   bg-black"
            }`}
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Sign in"}
          </Button>
        </div>
        <div className="mt-2">
          {error ? (
            <p className="text-center text-base text-red-700">{error}</p>
          ) : (
            <p className="text-center text-base text-green-700">{success}</p>
          )}
        </div>
      </form>
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>
          Do not have an account?{" "}
          <Link href="/register" className="text-black hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FormLoginWrapper;
