"use client";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";

export default function RegisterInput({
  name,
  type,
  placeholder,
  register,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="mt-8 content-center dark:text-dark_text_1 space-y-1 relative">
      <label htmlFor={name} className="text-sm font-bold tracking-wide  pl-1">
        {placeholder}
      </label>

      <input
        className="w-full dark:bg-dark_bg_3 text-base py-2  px-2 rounded-lg outline-none pr-10 h-10"
        type={
          name === "password" || name === "confirmPassword"
            ? showPassword
              ? "text"
              : "password"
            : type
        }
        placeholder={placeholder}
        {...register(name)}
      />
      {name === "password" || name === "confirmPassword" ? (
        <button
          type="button"
          className="absolute right-2 top-11 transform -translate-y-1/2 text-lg cursor-pointer h-10"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </button>
      ) : null}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
