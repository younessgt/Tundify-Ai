"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import Link from "next/link";
import { signUpSchema } from "../../utils/validation";
import RegisterInput from "./RegisterInput";

export default function RegisterForm() {
  const { status } = useSelector((state) => state.userState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const onSubmit = (data) => console.log(data);
  // console.log(watch());
  // console.log(errors);
  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden ">
      {/*container */}
      <div className="max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-lg">
        {/*heading */}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="text-3xl font-bold mt-6">Welcome To TundiFy</h2>
          <p className="text-sm mt-2"> Create an account to get started</p>
        </div>
        {/*form */}
        <form onSubmit={handleSubmit(onSubmit)} className=" mt-6  space-y-6">
          <RegisterInput
            name="name"
            type="text"
            placeholder="Name"
            register={register}
            error={errors?.name?.message}
          />
          <RegisterInput
            name="email"
            type="text"
            placeholder="Email Address"
            register={register}
            error={errors?.email?.message}
          />
          <RegisterInput
            name="password"
            type="password"
            placeholder="Password"
            register={register}
            error={errors?.password?.message}
          />
          <RegisterInput
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            register={register}
            error={errors?.confirmPassword?.message}
          />
          <RegisterInput
            name="status"
            type="text"
            placeholder="Status (Optional)"
            register={register}
            error={errors?.status?.message}
          />
          <button
            className="bg-dark_btn_1 text-gray-100 p-4 rounded-lg w-full tracking-wide font-semibold flex justify-center cursor-pointer focus:outline-none hover:bg-dark_btn_2 transition ease-in duration-200"
            type="submit"
          >
            {mounted && status === "loading" ? (
              <PulseLoader color="#fff" size={13} />
            ) : (
              "Register"
            )}
          </button>

          {/*sign in link */}
          <p className="flex flex-col items-center justify-center text-center dark:text-dark_text_1 ">
            <span>Have an account ?</span>
            <Link
              href="/login"
              className=" hover:underline cursor-pointer transition ease-in duration-300"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
