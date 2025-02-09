"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import RegisterInput from "./RegisterInput";
import { useForm } from "react-hook-form";
import { newPasswordSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { newPassword } from "../../features/userSlice";

import { resetError } from "../../features/userSlice";

export default function NewPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(newPasswordSchema),
  });
  const [mounted, setMounted] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const { status, error } = useSelector((state) => state.userState);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetError());
    setMounted(true);
  }, []);

  const onSubmit = async (dataForm) => {
    const resp = await dispatch(newPassword({ ...dataForm }));
    console.log("resp:", resp);
    if (resp.meta.requestStatus === "fulfilled") {
      setResetDone(true);
    }
  };
  return resetDone ? (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-lg sm:p-8">
        <div className="text-center dark:text-dark_text_1">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Password Reset Successful!
          </h2>
          <p className="text-sm mt-2">
            You can now log in with your new password.{" "}
            <Link
              href="/login"
              className="text-sm text-[#3575aa] hover:underline"
            >
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-lg sm:p-8">
        <div className="text-center dark:text-dark_text_1">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Please Enter New Password
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <RegisterInput
            name="newPassword"
            type="password"
            placeholder="New Password"
            register={register}
            error={errors?.newPassword?.message}
          />
          <RegisterInput
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            register={register}
            error={errors?.confirmPassword?.message}
          />
          {error && (
            <div className="flex justify-center">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          <button
            className="bg-dark_btn_1 text-gray-100 p-4 rounded-lg w-full tracking-wide font-semibold flex justify-center cursor-pointer focus:outline-none hover:bg-dark_btn_2 transition ease-in duration-200"
            type="submit"
            aria-label="reset password"
          >
            {mounted && status === "loading" ? (
              <PulseLoader color="#fff" size={13} />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
