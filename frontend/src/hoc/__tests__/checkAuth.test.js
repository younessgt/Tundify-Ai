import { getValidAccessToken } from "../../utils/getValidAccessToken";
import { jwtDecode } from "jwt-decode";
import { checkAuth } from "../checkAuth";
import { logout, updateAccessToken } from "../../features/userSlice";

jest.mock("../../utils/getValidAccessToken", () => ({
  getValidAccessToken: jest.fn(),
}));

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

jest.mock("../../features/userSlice", () => ({
  logout: jest.fn(),
  updateAccessToken: jest.fn(),
}));

describe("tests for checkAuth", () => {
  let setLoading;
  let isValidatedRef;
  let authInProgressRef;
  let dispatch;
  let router;

  beforeEach(() => {
    setLoading = jest.fn();
    isValidatedRef = { current: false };
    authInProgressRef = { current: false };
    dispatch = jest.fn();
    router = { replace: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should set loading to false if the user exists and the access token is valid and not expired", async () => {
    jwtDecode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 60 });

    await checkAuth({
      user: { accessToken: "valid-token" },
      setLoading,
      isValidatedRef,
      authInProgressRef,
      dispatch,
      router,
    });

    expect(setLoading).toHaveBeenCalledWith(false);
    expect(authInProgressRef.current).toBe(false);
    expect(router.replace).not.toHaveBeenCalled();
    expect(isValidatedRef.current).toBe(true);
    expect(dispatch).not.toHaveBeenCalled();
    expect(getValidAccessToken).not.toHaveBeenCalled();
  });

  it("should redirect to login if the user does not exist ", async () => {
    await checkAuth({
      user: null,
      setLoading,
      isValidatedRef,
      authInProgressRef,
      dispatch,
      router,
    });

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(authInProgressRef.current).toBe(false);
    expect(router.replace).toHaveBeenCalledWith("/login");
    expect(isValidatedRef.current).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
    expect(getValidAccessToken).not.toHaveBeenCalled();
  });

  it("should redirect to login if the accessToken does not exist ", async () => {
    await checkAuth({
      user: { accessToken: null },
      setLoading,
      isValidatedRef,
      authInProgressRef,
      dispatch,
      router,
    });

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(authInProgressRef.current).toBe(false);
    expect(router.replace).toHaveBeenCalledWith("/login");
    expect(isValidatedRef.current).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
    expect(getValidAccessToken).not.toHaveBeenCalled();
  });

  it("should request a new access token if the current one is expired", async () => {
    jwtDecode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 60 });
    getValidAccessToken.mockReturnValue("new-token");

    await checkAuth({
      user: { accessToken: "expired-token" },
      setLoading,
      isValidatedRef,
      authInProgressRef,
      dispatch,
      router,
    });

    expect(setLoading).toHaveBeenCalledWith(false);
    expect(authInProgressRef.current).toBe(false);
    expect(router.replace).not.toHaveBeenCalled();
    expect(isValidatedRef.current).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(updateAccessToken("new-token"));
    expect(getValidAccessToken).toHaveBeenCalled();
  });

  it("should redirect to login if an error occurs from getValidAccessToken", async () => {
    getValidAccessToken.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await checkAuth({
      user: { accessToken: "invalid-token" },
      setLoading,
      isValidatedRef,
      authInProgressRef,
      dispatch,
      router,
    });
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(dispatch).toHaveBeenCalledWith(logout());
    expect(router.replace).toHaveBeenCalledWith("/login");
    expect(authInProgressRef.current).toBe(false);
    expect(isValidatedRef.current).toBe(false);
  });

  it("should redirect to login if an error occurs from jwtDecode", async () => {
    jwtDecode.mockImplementation(() => {
      throw new Error("token problem ");
    });

    await checkAuth({
      user: { accessToken: "token" },
      setLoading,
      isValidatedRef,
      authInProgressRef,
      dispatch,
      router,
    });
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(dispatch).toHaveBeenCalledWith(logout());
    expect(router.replace).toHaveBeenCalledWith("/login");
    expect(authInProgressRef.current).toBe(false);
    expect(isValidatedRef.current).toBe(false);
  });
});
