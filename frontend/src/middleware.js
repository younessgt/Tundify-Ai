import { NextResponse } from "next/server";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/**
 * Middleware function to handle authentication and token validation.
 *
 * This middleware checks for the presence of a refresh token in the request cookies.
 * If the refresh token is not present or is invalid, it redirects the user to the login page.
 * If the refresh token is valid, it allows the request to proceed.
 *
 * @param {import('next/server').NextRequest} req - The incoming request object.
 * @returns {Promise<import('next/server').NextResponse>} - The response object, either redirecting to login or allowing the request to proceed.
 */

export async function middleware(req) {
  console.log("middleware");
  const AUTH_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`;
  const refreshToken = req.cookies.get("refresh_jwt")?.value;
  const url = req.nextUrl.clone();
  const isAuthPage = url.pathname === "/login" || url.pathname === "/register";

  // if (!refreshToken) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }
  if (!refreshToken) {
    // Redirect unauthenticated users trying to access the home page
    if (url.pathname === "/") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (refreshToken && isAuthPage) {
    console.log("redirecting to /");
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  try {
    const response = await axios.post(
      `${AUTH_ENDPOINT}/validateRefreshToken`,
      {
        refresh_jwt: refreshToken,
      }, // No body needed
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // checking the expiration time of the refresh token
    const tokenPayload = jwtDecode(refreshToken);
    const currentTime = Math.floor(Date.now() / 1000);

    if (tokenPayload.exp < currentTime) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register"],
};
