/* eslint-disable linebreak-style */
import { NextResponse } from "next/server";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { middleware } from "../middleware";

jest.mock("axios");
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    redirect: jest.fn(),
    next: jest.fn(),
  },
}));

describe("Testing middleware", () => {
  const AUTH_ENDPOINT = "http://example.com/api/auth";

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_ENDPOINT = "http://example.com/api";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect to login if no refreshToken is found in the cookies", async () => {
    const req = {
      cookies: { get: jest.fn(() => undefined) },
      url: "https://example.com/",
    };

    await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/login", req.url)
    );

    expect(NextResponse.next).not.toHaveBeenCalled();
  });

  it("should call the validateRefreshToken endpoint if refresh token exist", async () => {
    const req = {
      cookies: {
        get: jest.fn(() => ({
          value: "validRefreshToken",
        })),
      },
      url: "https://example.com/",
    };

    axios.post.mockResolvedValue({
      status: 200,
    });

    await middleware(req);

    expect(axios.post).toHaveBeenCalledWith(
      `${AUTH_ENDPOINT}/validateRefreshToken`,
      {
        refresh_jwt: "validRefreshToken",
      }, // No body needed
      {
        withCredentials: true,
      }
    );
  });

  it("should redirect to login if the refreshToken is not valid", async () => {
    const req = {
      cookies: {
        get: jest.fn(() => ({
          value: "notValidRefreshToken",
        })),
      },
      url: "https://example.com/",
    };

    axios.post.mockResolvedValue({
      status: 500,
    });

    await middleware(req);

    expect(axios.post).toHaveBeenCalledWith(
      `${AUTH_ENDPOINT}/validateRefreshToken`,
      {
        refresh_jwt: "notValidRefreshToken",
      }, // No body needed
      {
        withCredentials: true,
      }
    );

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/login", req.url)
    );
  });

  it("should redirect to login if the refreshToken is expired (checking the expiration time from the front end)", async () => {
    const req = {
      cookies: {
        get: jest.fn(() => ({
          value: "expiredRefreshToken",
        })),
      },
      url: "https://example.com/",
    };

    axios.post.mockResolvedValue({
      status: 200,
    });

    jwtDecode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 1000 });

    await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/login", req.url)
    );
  });

  it("should go to the next  if the refreshToken is valid and not expired", async () => {
    const req = {
      cookies: {
        get: jest.fn(() => ({
          value: "validRefreshToken",
        })),
      },
      url: "https://example.com/",
    };

    axios.post.mockResolvedValue({
      status: 200,
    });

    jwtDecode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 60 });

    await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
  });
});
