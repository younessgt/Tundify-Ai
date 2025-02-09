/* eslint-disable linebreak-style */
import * as Yup from "yup";

export const signUpSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .matches(/^[a-zA-Z_ ]*$/, "Special characters are not allowed")
    .min(2, "Name must be between 2 and 16 characters")
    .max(16, "Name must be between 2 and 16 characters"),

  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least 6 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character (e.g., @$!%*?&)."
    ),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
  status: Yup.string().max(64, "Status must be less than 64 characters"),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const newPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least 6 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character (e.g., @$!%*?&)."
    ),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
    "Passwords must match"
  ),
});

