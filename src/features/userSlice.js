import { createSlice } from "@reduxjs/toolkit";
// import { REHYDRATE } from "redux-persist";

const initialState = {
  status: "",
  error: "2",
  user: {
    id: "",
    name: "kamal",
    email: "",
    picture: "",
    token: "",
  },
};

export const userSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    logout: (state) => {
      state.status = "";
      state.error = "";
      state.user = {
        id: "",
        name: "",
        email: "",
        picture: "",
        token: "",
      };
    },
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
