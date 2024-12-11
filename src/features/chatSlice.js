import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const CONVERSATION_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/conversation`;

const initialState = {
  status: "",
  error: "",
  conversations: [],
  activeConversation: {},
  notifications: [],
  messages: [],
  files: [],
};

export const getConversations = createAsyncThunk(
  "get/all/conversation",
  async (accesstoken, { rejectWithValue }) => {
    try {
      const response = await axios.get(CONVERSATION_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const chatSlice = createSlice({
  name: "chatState",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        console.log("API Response for conversations:", action.payload);
        (state.status = "succeeded"),
          (state.conversations = action.payload.allConversations);
      })
      .addCase(getConversations.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload.message);
      });
  },
});

export default chatSlice.reducer;
