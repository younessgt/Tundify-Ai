"use client";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import { updateUser } from "@/features/userSlice";

// Page component that handles the Google Auth callback
function GoogleAuthCallback() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const resp = await axios.get("http://localhost:8000/api/v1/auth/me", {
        withCredentials: true,
      });
      if (resp.status === 200) {
        const user = resp.data.user;
        dispatch(updateUser(user));
        router.push("/");
      }
    } catch (error) {
      console.error("Error handling google Auth callback:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    handleGoogleAuth();
  }, [router, dispatch]);

  return (
    <div className="flex justify-center items-center h-screen dark:bg-dark_bg_1">
      <CircularProgress
        style={{ color: "#ff5722" }}
        data-testid="loading-spinner"
      />
    </div>
  );
}

export default GoogleAuthCallback;
