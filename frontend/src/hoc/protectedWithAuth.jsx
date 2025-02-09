/* eslint-disable linebreak-style */
"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
// import { logout, updateAccessToken } from "../features/userSlice";
// import { getValidAccessToken } from "../utils/getValidAccessToken";
import { CircularProgress } from "@mui/material";
import { checkAuth } from "./checkAuth";

/**
 * Higher-order component that protects a wrapped component with authentication.
 * It checks if the user is authenticated and has a valid access token.
 * If the user is not authenticated, it redirects to the login page.
 * If the user is authenticated, it renders the wrapped component.
 *
 * @param {React.ComponentType} WrappedComponent - The component to be wrapped and protected.
 * @returns {React.FC} - A functional component that wraps the provided component with authentication logic.
 */

export default function protectedWithAuth(WrappedComponent) {
  return (props) => {
    const { user } = useSelector((state) => state.userState);
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const isValidatedRef = useRef(false);
    const authInProgressRef = useRef(false);

    useEffect(() => {
      checkAuth({
        user,
        setLoading,
        isValidatedRef,
        authInProgressRef,
        dispatch,
        router,
      });
    }, []);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen dark:bg-dark_bg_1">
          <CircularProgress
            style={{ color: "#ff5722" }}
            data-testid="loading-spinner"
          />
        </div>
      );
    }

    return <WrappedComponent {...props} user={user} />;
  };
}

