"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import Link from "next/link";
import { signUpSchema } from "../../utils/validation";
import RegisterInput from "./RegisterInput";
import { registerUser } from "../../features/userSlice";
import { useRouter } from "next/navigation";
import Picture from "./Picture";
import axios from "axios";

export default function RegisterForm() {
  const { status, error, user } = useSelector((state) => state.userState);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [picture, setPicture] = useState(null);
  const [pictureBase64, setPictureBase64] = useState("");
  const [errorPicture, setErrorPicture] = useState("");

  const cloudary_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const cloudary_preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const AUTH_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`;

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

  // Function to upload the image to Cloudinary
  const uploadImageToCloud = async () => {
    const formData = new FormData();
    formData.append("file", picture);
    formData.append("upload_preset", cloudary_preset);

    const resp = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudary_name}/image/upload`,
      formData
    );
    return resp.data;
  };

  const handlePictureError = (error) => {
    setErrorPicture(error);
  };

  // Function to validate the registration form data
  const validateRegistration = async (dataForm) => {
    try {
      const response = await axios.post(
        `${AUTH_ENDPOINT}/validate-register`,
        dataForm
      );
      return response.data;
    } catch (error) {
      // console.log("Error from validateRegistration: ", error.response.data);
      throw new Error(error.response?.data?.message || "Validation failed");
    }
  };
  const onSubmit = async (dataForm) => {
    // console.log("data");

    if (errorPicture) {
      // console.log("errorPicture", errorPicture);
      return;
    }

    // This block of code is used to validate the registration form data
    // If the data is valid, we can move  forward with the registration process
    try {
      await validateRegistration(dataForm);
      console.log("tr");
    } catch (error) {
      console.log("Error Coming From registartion validation : ", error);
      return;
    }

    let pictureUrl = "";

    // If the user has uploaded a picture, we will upload it to Cloudinary
    if (picture) {
      const data = await uploadImageToCloud();
      pictureUrl = data.secure_url;
    }

    // Dispatch the registerUser action to register the user
    const resp = await dispatch(
      registerUser({ ...dataForm, picture: pictureUrl })
    );

    // If the user is successfully registered, redirect them to the home page
    if (resp.payload?.user) {
      router.push("/");
    }
  };

  return (
    <div className=" min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 border-2">
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
            onError={handlePictureError}
          />
          {error && (
            <div>
              <p className="text-red-500 text-xs">{error}</p>
            </div>
          )}
          <button
            className="bg-dark_btn_1 text-gray-100 p-4 rounded-lg w-full tracking-wide font-semibold flex justify-center cursor-pointer focus:outline-none hover:bg-dark_btn_2 transition ease-in duration-200"
            type="submit"
            aria-label="Register"
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
