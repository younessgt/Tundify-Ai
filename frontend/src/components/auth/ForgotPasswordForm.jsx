"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import RegisterInput from "./RegisterInput";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { forgotPassword } from "../../features/userSlice";
// import { useRouter } from "next/navigation";
import { setResetCheckAccess, resetError } from "../../features/userSlice";

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });
  const [mounted, setMounted] = useState(false);
  const { status, error } = useSelector((state) => state.userState);
  const [checkEmail, setCheckEmail] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetError());
    setMounted(true);
  }, []);

  const onSubmit = async (dataForm) => {
    const resp = await dispatch(forgotPassword({ ...dataForm }));
    // console.log("resp:", resp);
    if (resp.meta.requestStatus === "fulfilled") {
      dispatch(setResetCheckAccess(true));
      // router.push("/reset-check-email");
      setCheckEmail(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-lg sm:p-8">
        {checkEmail ? (
          <>
            <h2 className="text-2xl font-bold sm:text-3xl text-[#ff5722]">
              Verify Your Email
            </h2>
            <p className="text-base text-white">
              We've sent a verification link to your email. Please check your
              inbox and verify your email to proceed with resetting your
              password.
            </p>
          </>
        ) : (
          <>
            <div className="text-center dark:text-dark_text_1">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Forgot Password?
              </h2>
              <p className="text-sm mt-2">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-sm text-[#3575aa] hover:underline"
                >
                  Login Here
                </Link>
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <RegisterInput
                name="email"
                type="text"
                placeholder="Email Address"
                register={register}
                error={errors?.email?.message}
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
          </>
        )}
      </div>
    </div>
  );
}
