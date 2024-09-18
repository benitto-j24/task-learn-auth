"use client";

import Link from "next/link";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { auth } from "../app/firebase/config";
import {
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const [input, setInput] = useState({
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  //onchange fn
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const exists = await fetchSignInMethodsForEmail(auth, input.email);

      if (exists.length) {
        await sendPasswordResetEmail(auth, input.email);
        toast.success("Email send successfully");
        setInput({
          email: "",
        });
      } else {
        setErrors({
          error: "User not found",
        });
        toast.error("User not found");
      }
    } catch (error: any) {
      if (error.code === "auth/missing-email") {
        toast.error("email field is required");
      } else if (error.code === "auth/invalid-email") {
        toast.error("this is not a valid email");
      }
      if (error.code === "auth/user-not-found") {
        toast.error("User not found");
      }
      setErrors({
        error: error.code,
      });
    }
  };

  console.log(errors);
  

  return (
    <div className="w-[800px] h-[350px] flex justify-center">
      <div className=" font-Poppins mt-3">
        <Link
          href={"/"}
          className="flex font-medium items-center gap-x-1 text-blue-500"
        >
          <IoArrowBack />
          Back to Sign in
        </Link>
        <h1 className=" text-[1.2rem] font-bold mt-5">
          Forget Password? Enter your Email ID
        </h1>
        <form
          className="flex flex-col w-[80%] mt-4 gap-y-6"
          onSubmit={handleSubmit}
        >
          <input
            className={`border-2 p-[7px] rounded-sm ${
              errors.error ? "border-red-500 outline-red-500" : ""
            }`}
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={input.email}
            required
          />
          <button className=" bg-blue-500 p-[7px] font-medium rounded-md text-white hover:shadow-[inset_0_0_0_200px_rgba(0,0,0,0.5)]">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
