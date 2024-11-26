/* eslint-disable linebreak-style */
"use client";

import { store } from "../store/store";
import axios from "axios";

// import { logout, updateAccessToken } from "../features/userSlice";

/**
 * Retrieves a valid access token. If the current access token is expired, it attempts to refresh it.
 *
 * @async
 * @function getValidAccessToken
 * @returns {Promise<string>} The valid access token.
 * @throws {Error} If no access token is found, if the access token is invalid, or if there is an error during validation or refresh.
 */
export const getValidAccessToken = async () => {
  const state = store.getState();
  const accessToken = state.userState.user.accessToken;

  const AUTH_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`;

  // check if the access token exists
  if (!accessToken) {
    throw new Error("No access token found");
  }

  try {
    // check if the access token is valid

    const response = await axios.get(`${AUTH_ENDPOINT}/validateAccessToken`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { valid, expired } = response.data;

    if (!valid && !expired) {
      throw new Error("Invalid access token");
    }

    if (expired) {
      // refresh the access token and return the new one
      const resp = await axios.post(
        `${AUTH_ENDPOINT}/refreshToken`,
        {},
        {
          withCredentials: true,
        }
      );

      if (resp.status === 200) {
        const newAccessToken = resp.data.user.accessToken;
        // store.dispatch(updateAccessToken(newAccessToken));
        return newAccessToken;
      } else {
        // store.dispatch(logout());
        throw new Error("Failed to refresh access token");
      }
    }

    return accessToken;
  } catch (error) {
    // store.dispatch(logout());
    if (
      error.message === "Invalid access token" ||
      error.message === "Failed to refresh access token"
    ) {
      throw new Error(error.message);
    }
    throw new Error("Error during accessToken validation");
  }
};
