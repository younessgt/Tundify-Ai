/* eslint-disable linebreak-style */
"use client";

import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/validation";
import RegisterInput from "./RegisterInput";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { loginUser } from "../../features/userSlice";
import { useRouter } from "next/navigation";
import PulseLoader from "react-spinners/PulseLoader";
import { useEffect, useState } from "react";
// import axios from "axios";

export default function LoginForm() {
  const { status, error, user } = useSelector((state) => state.userState);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (dataForm) => {
    const resp = await dispatch(loginUser({ ...dataForm }));
    // console.log("resp:", resp);
    if (resp.payload?.user) {
      router.push("/");
    }
  };

  const handleAuthGoogle = () => {
    window.location.href = "http://localhost:8000/api/v1/auth/google";
  };

  return (
    <div className=" min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 ">
      <div className="  w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-lg sm:p-8">
        <div className="text-center dark:text-dark_text_1">
          <h2 className="text-2xl sm:text-3xl font-bold  ">Sign in</h2>

          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={handleAuthGoogle}
              className="bg-red-500 text-white p-2 rounded-full w-[40px]"
              aria-label="Google"
            >
              <i className="fab fa-google"></i>
            </button>

            <button
              className="bg-blue-600 text-white  p-2 rounded-full w-[40px]"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </button>
          </div>
          <p className="text-sm mt-2"> Or use your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
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
          <p className="flex flex-col items-center justify-center text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-[#3575aa] hover:underline"
            >
              Forgot Your Password?
            </Link>
          </p>

          <button
            className="bg-dark_btn_1 text-gray-100 p-4 rounded-lg w-full tracking-wide font-semibold flex justify-center cursor-pointer focus:outline-none hover:bg-dark_btn_2 transition ease-in duration-200"
            type="submit"
            aria-label="sign in"
          >
            {mounted && status === "loading" ? (
              <PulseLoader color="#fff" size={13} />
            ) : (
              "Sign In"
            )}
          </button>
          {error && (
            <div className="flex justify-center">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          <p className="flex flex-col items-center justify-center text-center dark:text-dark_text_1">
            <span>Don't Have an account?</span>
            <Link
              href="/register"
              className="hover:underline cursor-pointer transition ease-in duration-300"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

