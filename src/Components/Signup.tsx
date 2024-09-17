"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { auth } from "../app/firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { signupSchema } from "@/app/signup/signupValidation";
import * as Yup from "yup";
import { rules } from "@/app/signup/signupValidation";
import { getErrorMessage } from "@/app/signup/errorMessage";
import { BsEye } from "react-icons/bs";
import { BsEyeSlash } from "react-icons/bs";
import { db } from "../app/firebase/config";
import { addDoc, collection, getDocs } from "firebase/firestore";

const Signup = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

    const [open, setOpen] = useState(false);

  //form data inputs state

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  //error state

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errors2, setErrors2] = useState<Record<string, string>>({});

  //check submit state

  const [submitting, setSubmitting] = useState(false);

  //validate fn

  const validate = async (formData: any) => {
    try {
      setErrors({});
      await signupSchema.validate(formData, { abortEarly: false });
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

const eyeOpen=()=>{
  setOpen(!open)
}

const saveUserEmail=async(email:string | null):Promise<void>=>{
  if (email === null) {
    console.error("User email is empty");
    return;
  }
  try {
    const userId = auth.currentUser?.uid;

    if (userId) {
      await addDoc(collection(db,"users"),{
        email:email,
        uid:userId,
      })
    } else {
      console.error('No authenticated user found');
    }
  }
  catch(error:any){
    toast.error(`Error saving email:${error}`);
  }
}

  //onblur fn

  //onSubmit fn
  const handleSubmit = async (e: React.FormEvent) => {
    setErrors({});
    e.preventDefault();
    try {
      await validate(formData);
      setSubmitting(true);
      if (Object.keys(errors).length === 0 && submitting) {
        await createUserWithEmailAndPassword(
          auth,
          formData.email as string,
          formData.password as string
        );
        const user = auth.currentUser;
        if(user){

          await saveUserEmail(user.email);
          toast.success("Register successfully");

        }
        
        setErrors2({});
        setFormData({
          email: "",
          phone: "",
          password: "",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorCode = (error as any).code;

        const errorMessage = getErrorMessage(errorCode);
        setErrors2({
          error: errorMessage,
        });
      }
    }
  };

  //onInput fn

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    target.value = target.value.slice(0, 10);
  };

  //onchange fn
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //useEffect

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className=" mt-5 min-w-[600px] h-[750px] bg-white shadow-md rounded-3xl z-10">
      <div className="mt-[1rem]">
        <h1 className=" text-[2.5rem] text-center text-primary font-medium">
          T-askLearn
        </h1>
        <p className=" text-primary text-center font-medium text-[11px]">
          Collaborate to Learn,Learn to Collaborate
        </p>
      </div>

      <div className=" flex flex-col">
        <h1 className="text-2xl text-center mt-3 font-medium font-Poppins ">
          Create an account
        </h1>
        <form
          className="flex flex-col w-[85%] mx-auto mt-[1.5rem] gap-y-5 font-Poppins"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-y-3">
            <label className=" text-gray-400" htmlFor="email">
              Email
            </label>
            <div className="flex relative items-center ">
              <input
                className={` w-full border-2 p-[7px] rounded-lg outline-gray-400 ${
                  errors.email ? "border-red-500 outline-red-500" : ""
                } ${errors2.error ? "border-red-500 outline-red-500" : ""} `}
                type="text"
                name="email"
                id="email"
                ref={inputRef}
                value={formData.email}
                onChange={handleChange}
              />
              {errors2.error && (
                <p className=" absolute right-[-17rem] text-[14px] bg-red-500 text-white p-1 px-2 rounded-md z-20">
                  {errors2.error}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-y-3">
            <label className=" text-gray-400" htmlFor="phone">
              Phone
            </label>
            <input
              className={`border-2 p-[7px] rounded-lg outline-gray-400 ${
                errors.phone ? "border-red-500 outline-red-500" : ""
              }`}
              type="number"
              inputMode="numeric"
              name="phone"
              id="phone"
              onInput={handleInput}
              value={formData.phone}
              onChange={handleChange}
            />
            <p
              className={`text-[12px] text-gray-400 ${
                errors.phone ? "text-red-500 " : ""
              }`}
            >
              We strongly recommend adding a phone number.this will help verify
              your account and keep it safe
            </p>
          </div>
          <div className="grid gap-y-3 ">
            <div className=" flex justify-between items-center">
              <label className=" text-gray-400" htmlFor="password">
                Password
              </label>
              <div className="flex items-center gap-x-1 text-gray-400">
                {open ? (
                  <BsEye onClick={eyeOpen} />
                ) : (
                  <BsEyeSlash onClick={eyeOpen} />
                )}

                <p className=" select-none">{open ? "Show" : "Hide"}</p>
              </div>
            </div>
            <input
              className={`border-2 p-[7px] rounded-lg outline-gray-400 ${
                errors.password ? "border-red-500 outline-red-500" : ""
              }`}
              type={`${open ? "text" : "password"}`}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => validate(formData)}
            />

            <div className="grid grid-cols-2 gap-y-2">
              {rules.map((rule, index) => {
                let cn =
                  formData.password && formData.password.match(rule.pattern)
                    ? "text-primary font-medium"
                    : "text-gray-400";
                return (
                  <li
                    key={index}
                    className={`text-[11px] text-gray-400  select-none ${cn}`}
                  >
                    {rule.label}
                  </li>
                );
              })}
            </div>
          </div>
          <button className=" mt-[1rem] p-3 text-white bg-primary rounded-full  hover:shadow-[inset_0_0_0_200px_rgba(0,0,0,0.5)] font-medium">
            Sign up
          </button>
        </form>
        <p className=" mx-auto mt-[1.5rem] text-[15px]">
          By creating an account,you agree to the{" "}
          <Link className=" underline font-semibold" href={""}>
            Terms of use
          </Link>{" "}
          and{" "}
          <Link className=" underline font-semibold" href={""}>
            Privacy Policy
          </Link>
        </p>
        <p className="w-[85%] mx-auto mt-5 text-gray-400">
          Already have an account{" "}
          <Link className=" underline text-black font-medium" href={"/"}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
