import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import { REHYDRATE } from "redux-persist";

const AUTH_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`;

const initialState = {
  status: "",
  error: "",
  user: {
    id: "",
    name: "",
    email: "",
    picture: "",
    accessToken: "",
  },
};

// Create an asynchronous thunk action for user registration.
// This will handle the API call to the registration endpoint and handle success or error responses.
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${AUTH_ENDPOINT}/register`, {
        ...values,
      });

      return response.data;
    } catch (error) {
      // console.log("error from registerUser", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${AUTH_ENDPOINT}/login`, {
        ...values,
      });

      return response.data;
    } catch (error) {
      // console.log("error from registerUser", error);
      return rejectWithValue(error.response.data);
    }
  }
);

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
        accessToken: "",
      };
    },

    updateAccessToken: (state, action) => {
      state.user.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "successRegister";
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "successLogin";
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
