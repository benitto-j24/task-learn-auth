"use client";

import { useEffect, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import * as Yup from "yup";
import { resetSchema } from "./cnfirmValidation";
import { rules } from "./cnfirmValidation";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { auth } from "../firebase/config";
import { confirmPasswordReset } from "firebase/auth";
import { BsEye } from "react-icons/bs";
import { BsEyeSlash } from "react-icons/bs";

const page = () => {
  const [open, setOpen] = useState(false);
  const[submit,setSubmit]=useState(false)
    const [open2, setOpen2] = useState(false);
  const [inputs, setInputs] = useState({
    password: "",
    cnpassword: "",
  });

  const router = useRouter();

  const [infoOpen, setInfoOpen] = useState(false);

  const [oobCode, setOobCode] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const eyeOpen = () => {
    setOpen(!open);
  };

   const eyeOpen2 = () => {
     setOpen2(!open2);
   };
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get("oobCode");
    if (code) {
      setOobCode(code);
    }
  }, []);


  //onchange fn
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const openInfo = () => {
    setInfoOpen(!infoOpen);
  };

  const validate = async (inputs: any) => {
    try {
      await resetSchema.validate(inputs, { abortEarly: false });
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

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    validate(inputs);
    setSubmit(true)
    if (!oobCode) {
      toast.error("Invalid password reset link.");
      return;
    }
    if (Object.keys(errors).length === 0 ) {
      try {
        await confirmPasswordReset(auth, oobCode, inputs.password);
        toast.success("Password reset successfully.");
        router.push("/");
      } catch (error:any) {
        toast.error(error.message)
      
      }
    }
  };


  return (
    <div className="w-full h-[100vh] flex justify-center mt-[3rem]">
      <div className="w-[900px] h-[350px] flex justify-center">
        <div className=" font-Poppins mt-3">
          <h1 className=" text-[1.2rem] font-bold mt-5">
            Enter your new password here
          </h1>
          <form
            className="flex flex-col w-full mt-4 gap-y-6 "
            onSubmit={handleSubmit}
          >
            <div className="flex relative items-center">
              <input
                className={`border-2 p-[7px] rounded-sm w-full placeholder:select-none ${
                  errors.password ? "border-red-500 outline-red-500" : ""
                }`}
                type={`${open ? "text" : "password"}`}
                id="password"
                name="password"
                placeholder="new password"
                onChange={handleChange}
              />

              {open ? (
                <BsEye
                  className=" absolute right-[2rem] text-gray-400"
                  onClick={eyeOpen}
                />
              ) : (
                <BsEyeSlash
                  className=" absolute right-[2rem] text-gray-400"
                  onClick={eyeOpen}
                />
              )}

              <IoIosInformationCircleOutline
                className={` absolute right-1 text-gray-400 ${
                  errors.password ? " text-red-500 " : ""
                }`}
                size={20}
                onClick={openInfo}
              />
              {infoOpen && (
                <div className="w-[270px] h-[120px] bg-gray-200 absolute z-20 right-[-17rem] top-[0rem] rounded-xl p-2 flex flex-col gap-y-3">
                  {rules.map((rule, index) => {
                    let cn =
                      inputs.password && inputs.password.match(rule.pattern)
                        ? "text-primary font-medium"
                        : "text-gray-500";
                    return (
                      <li
                        className={`text-[11px] text-gray-400 ${cn}`}
                        key={index}
                      >
                        {rule.label}
                      </li>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <div className=" relative ">
                <input
                  className={`border-2 p-[7px] rounded-sm w-full placeholder:select-none  ${
                    errors.cnpassword ? "border-red-500 outline-red-500" : ""
                  }`}
                  type={`${open2 ? "text" : "password"}`}
                  id="cnpassword"
                  name="cnpassword"
                  placeholder="re-enter new password"
                  onChange={handleChange}
                  onBlur={()=>validate(inputs)}
                />
                {open2 ? (
                  <BsEye
                    className=" absolute right-2 top-[14px] text-gray-400"
                    onClick={eyeOpen2}
                  />
                ) : (
                  <BsEyeSlash
                    className=" absolute right-2 top-[14px] text-gray-400"
                    onClick={eyeOpen2}
                  />
                )}
              </div>

              {errors.cnpassword && (
                <p className="text-[12px] mt-3 text-red-500">
                  {errors.cnpassword}
                </p>
              )}
            </div>

            <button className=" bg-blue-500 p-[7px] font-medium rounded-md  text-white hover:shadow-[inset_0_0_0_200px_rgba(0,0,0,0.5)] select-none">
              Confirm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
