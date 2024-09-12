"use client";

import Link from "next/link";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { auth } from "../app/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const [input, setInput] = useState({
    email: "",
  });

  //onchange fn
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, input.email as string);
      setInput({
        email: "",
      });
      toast.success("Link send to email");
    } catch (error) {
      if (error instanceof Error) {
        const errorCode = (error as any).code;
        console.log(errorCode);
      }
    }
  };
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
            className="border-2 p-[7px] rounded-sm"
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={input.email}
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
