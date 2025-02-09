/* eslint-disable linebreak-style */
import { jwtDecode } from "jwt-decode";

import { getValidAccessToken } from "../utils/getValidAccessToken";
import { logout, updateAccessToken } from "../features/userSlice";

export const checkAuth = async ({
  user,
  setLoading,
  isValidatedRef,
  authInProgressRef,
  dispatch,
  router,
}) => {
  // Prevent multiple calls
  if (authInProgressRef.current) {
    return;
  }
  authInProgressRef.current = true;

  if (isValidatedRef.current) {
    setLoading(false);
    authInProgressRef.current = false;
    return;
  }

  // Redirect to login if no user or access token
  if (!user || !user.accessToken) {
    setLoading(true);
    authInProgressRef.current = false;
    return router.replace("/login");
  }

  try {
    // console.log("try");
    // Decode the access token and check expiration
    const decodedToken = jwtDecode(user.accessToken);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp > currentTime) {
      isValidatedRef.current = true;
      setLoading(false);
      authInProgressRef.current = false;
      return;
    }

    const accessToken = await getValidAccessToken();

    if (accessToken && accessToken !== user.accessToken) {
      dispatch(updateAccessToken(accessToken));
    }

    isValidatedRef.current = true;
    setLoading(false);
  } catch (error) {
    dispatch(logout());
    setLoading(true);
    router.replace("/login");
  } finally {
    authInProgressRef.current = false;
  }
};

