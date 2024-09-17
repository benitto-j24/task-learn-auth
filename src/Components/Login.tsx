"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../app/firebase/config";
import { loginSchema } from "./loginValidation";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as Yup from "yup";
import { getErrorMessage2 } from "./loginErrorMessage2";

const Login = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const router = useRouter();

  //onchange fn
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //error state

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errors2, setErrors2] = useState<Record<string, string>>({});

  //check submit state

  const [submitting, setSubmitting] = useState(false);

  //validate fn

  const validate = async (formData: any) => {
    try {
      setErrors({});
      await loginSchema.validate(formData, { abortEarly: false });
    } catch (err) {
      let newErrors: any = {};
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  //onblur fn

  //onSubmit fn
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      await validate(formData);
      setSubmitting(true);
      await signInWithEmailAndPassword(
        auth,
        formData.email as string,
        formData.password as string
      );
      const user = auth.currentUser;
      router.push("/dashboard");
      toast.success("login success");
      setErrors2({});
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      if (error instanceof Error) {
        const errorCode = (error as any).code;
        console.log(errorCode);
        const errorMessage = getErrorMessage2(errorCode);
        setErrors2({
          error: errorMessage,
        });
      }
    }
  };

  console.log(errors2);

  useEffect(() => {
    if (errors2.error) {
      toast.error(errors2.error);
    }
  }, [errors2]);

  return (
    <div className=" mt-[5rem] min-w-[620px] h-[540px] bg-white shadow-md rounded-3xl z-10">
      <div className="mt-[1.7rem]">
        <h1 className=" text-[2.5rem] text-center text-primary font-medium">
          T-askLearn
        </h1>
        <p className=" text-primary text-center font-medium text-[11px] ">
          Collaborate to Learn,Learn to Collaborate
        </p>
      </div>
      <form
        className="w-[85%] mx-auto flex flex-col gap-y-[2rem] mt-[3rem] font-Poppins "
        onSubmit={handleSubmit}
      >
        <div className="flex items-center">
          <label className="w-[40%] text-gray-500" htmlFor="">
            Username or Email
          </label>
          <input
            className={`border-2 w-[60%] p-1 rounded-md outline-gray-400 ${
              errors.email ? "border-red-500 outline-red-500" : ""
            } ${errors2.error ? "border-red-500 outline-red-500" : ""}`}
            type="text"
            name="email"
            id="email"
            ref={inputRef}
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center">
          <label className="  w-[40%] text-gray-500 " htmlFor="">
            Password
          </label>
          <input
            className={`border-2  w-[60%] p-1 rounded-md outline-gray-400 ${
              errors.password ? "border-red-500 outline-red-500" : ""
            }
            ${errors2.error ? "border-red-500 outline-red-500" : ""}`}
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className=" text-right">
          <Link className=" text-[14px] underline" href={"/forget-password"}>
            Forget Password
          </Link>
        </div>
        <button className=" bg-primary mt-4 w-[18%] hover:shadow-[inset_0_0_0_200px_rgba(0,0,0,0.5)] font-medium text-white mx-auto p-[2px] rounded-md">
          Login
        </button>
      </form>
      <div className="w-[85%]  mx-auto flex justify-center mt-3">
        <button
          className=" bg-primary mt-4 w-[25%] hover:shadow-[inset_0_0_0_200px_rgba(0,0,0,0.5)] font-medium text-white p-[5px] rounded-md mx-auto "
          onClick={() => router.push("/signup")}
        >
          Create account
        </button>
      </div>
    </div>
  );
};

export default Login;
