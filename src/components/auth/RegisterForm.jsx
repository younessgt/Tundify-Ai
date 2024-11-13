"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import Link from "next/link";
import { signUpSchema } from "../../utils/validation";
import RegisterInput from "./RegisterInput";
import { registerUser } from "../../features/userSlice";
import { useRouter } from "next/navigation";
import Picture from "./Picture";

export default function RegisterForm() {
  const { status, error, user } = useSelector((state) => state.userState);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [picture, setPicture] = useState(null);
  const [pictureBase64, setPictureBase64] = useState("");

  useEffect(() => {
    // Setting mounted to true after the component is rendered
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    const resp = await dispatch(
      registerUser({ ...data, picture: pictureBase64 })
    );
    console.log("response from Onsbmit: ", resp);

    if (resp.payload.user) {
      router.push("/");
    }
    // console.log(data);
  };

  return (
    <div className=" min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 ">
      <div className="  w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-lg sm:p-8">
        <div className="text-center dark:text-dark_text_1">
          <h2 className="text-2xl sm:text-3xl font-bold  ">
            Welcome To TundiFy
          </h2>
          <p className="text-sm mt-2"> Create an account to get started</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
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
          <Picture
            pictureBase64={pictureBase64}
            setPicture={setPicture}
            setPictureBase64={setPictureBase64}
          />
          {error && (
            <div>
              <p className="text-red-500 text-xs">{error}</p>
            </div>
          )}
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
          <p className="flex flex-col items-center justify-center text-center dark:text-dark_text_1">
            <span>Have an account?</span>
            <Link
              href="/login"
              className="hover:underline cursor-pointer transition ease-in duration-300"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
