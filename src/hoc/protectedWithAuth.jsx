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

    // export const checkAuth = async ({
    //   user,
    //   setLoading,
    //   isValidatedRef,
    //   authInProgressRef,
    //   dispatch,
    //   router,
    // }) => {
    //   console.log("checkAuth started");
    //   // Prevent multiple calls
    //   if (authInProgressRef.current) {
    //     return;
    //   }
    //   authInProgressRef.current = true;

    //   if (isValidatedRef.current) {
    //     setLoading(false);
    //     authInProgressRef.current = false;
    //     return;
    //   }

    //   // Redirect to login if no user or access token
    //   if (!user || !user.accessToken) {
    //     setLoading(true);
    //     authInProgressRef.current = false;
    //     return router.replace("/login");
    //   }

    //   try {
    //     // Decode the access token and check expiration
    //     const decodedToken = jwtDecode(user.accessToken);
    //     const currentTime = Math.floor(Date.now() / 1000);

    //     if (decodedToken.exp > currentTime) {
    //       isValidatedRef.current = true;
    //       setLoading(false);
    //       console.log("test2");
    //       authInProgressRef.current = false;
    //       return;
    //     }

    //     const accessToken = await getValidAccessToken();

    //     console.log("Access token retrieved:", accessToken);

    //     if (accessToken && accessToken !== user.accessToken) {
    //       dispatch(updateAccessToken(accessToken));
    //     }

    //     isValidatedRef.current = true;
    //     setLoading(false);
    //     console.log("setLoading called with false");
    //   } catch (error) {
    //     dispatch(logout());
    //     setLoading(true);
    //     router.replace("/login");
    //   } finally {
    //     authInProgressRef.current = false;
    //   }
    // };

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
