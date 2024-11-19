/* eslint-disable linebreak-style */
import { NextResponse } from "next/server";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export async function middleware(req) {
  const AUTH_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`;
  const refreshToken = req.cookies.get("refresh_jwt")?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
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
  matcher: "/",
};
