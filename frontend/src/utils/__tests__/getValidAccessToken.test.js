/* eslint-disable linebreak-style */
import configureMockStore from "redux-mock-store";
import { getValidAccessToken } from "../getValidAccessToken";
import { store } from "../../store/store";
import axios from "axios";
import { get } from "react-hook-form";

jest.mock("../../store/store", () => ({
  store: {
    getState: jest.fn(),
  },
}));

jest.mock("axios");

describe("getValidAccessToken", () => {
  const AUTH_ENDPOINT = "http://example.com/api/auth";

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_ENDPOINT = "http://example.com/api";
  });

  it("should throw an error if no access token is found", async () => {
    store.getState.mockReturnValue({ userState: { user: {} } });

    await expect(getValidAccessToken()).rejects.toThrow(
      "No access token found"
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if the access token is invalid and not expired", async () => {
    store.getState.mockReturnValue({
      userState: { user: { accessToken: "invalidToken" } },
    });

    axios.get.mockResolvedValue({
      data: { valid: false, expired: false },
    });

    await expect(getValidAccessToken()).rejects.toThrow("Invalid access token");
    expect(axios.get).toHaveBeenCalledWith(
      `${AUTH_ENDPOINT}/validateAccessToken`,
      {
        headers: {
          Authorization: "Bearer invalidToken",
        },
      }
    );
  });

  it("should access the refresh token endpoint if the access token is expired", async () => {
    store.getState.mockReturnValue({
      userState: { user: { accessToken: "expiredToken" } },
    });
    axios.get.mockResolvedValue({ data: { valid: false, expired: true } });
    axios.post.mockResolvedValue({
      status: 200,
      data: { user: { accessToken: "newAccessToken" } },
    });
    await getValidAccessToken();
    expect(axios.post).toHaveBeenCalledWith(
      `${AUTH_ENDPOINT}/refreshToken`,
      {},
      {
        withCredentials: true,
      }
    );
  });

  it("should refresh the access token is expired", async () => {
    store.getState.mockReturnValue({
      userState: { user: { accessToken: "expiredToken" } },
    });
    axios.get.mockResolvedValue({ data: { valid: false, expired: true } });
    axios.post.mockResolvedValue({
      status: 200,
      data: { user: { accessToken: "newAccessToken" } },
    });
    const token = await getValidAccessToken();
    expect(token).toBe("newAccessToken");
  });

  it("should throw an error if the refresh fails", async () => {
    store.getState.mockReturnValue({
      userState: { user: { accessToken: "expiredToken" } },
    });
    axios.get.mockResolvedValue({ data: { valid: false, expired: true } });
    axios.post.mockResolvedValue({
      status: 500,
    });
    await expect(getValidAccessToken()).rejects.toThrow(
      "Failed to refresh access token"
    );
  });

  it("should throw an error during validation or refresh token error", async () => {
    store.getState.mockReturnValue({
      userState: { user: { accessToken: "someToken" } },
    });

    axios.get.mockRejectedValue(new Error("Network Error"));

    await expect(getValidAccessToken()).rejects.toThrow(
      "Error during accessToken validation"
    );
  });
});
