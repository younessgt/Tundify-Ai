"use client";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function newPassword() {
  const [loading, setLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);
  const AUTH_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`;
  const router = useRouter();

  const validateAccess = async () => {
    try {
      const resp = await axios.get(`${AUTH_ENDPOINT}/me`, {
        withCredentials: true,
      });
      return resp.status === 200;
    } catch (error) {
      console.error("Error validating access:");
      return false;
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      const access = await validateAccess();
      console.log("access:", access);
      if (!access) {
        router.push("/something-went-wrong");
      } else {
        setAccessGranted(true);
      }
      setLoading(false);
    };

    checkAccess();
  }, [router]);

  if (loading || !accessGranted) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-dark_bg_1">
        <CircularProgress
          style={{ color: "#ff5722" }}
          data-testid="loading-spinner"
        />
      </div>
    );
  }

  // if (!accessGranted) {
  //   return null;
  // }

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/*Container */}
      <div className=" flex  w-[1600px] h-full mx-auto">
        {/*Login Form */}
        <NewPasswordForm />
      </div>
    </div>
  );
}
