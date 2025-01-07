import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const CONVERSATION_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/conversation`;
const MESSAGE_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/message`;

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

export const createOpenConversation = createAsyncThunk(
  "create/open/conversation",
  async (values, { rejectWithValue }) => {
    const { accesstoken, recieverId, isGroup } = values;
    try {
      const response = await axios.post(
        CONVERSATION_ENDPOINT,
        {
          recieverId,
          isGroup,
        },
        {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getConversationMessages = createAsyncThunk(
  "get/all/messages",
  async (values, { rejectWithValue }) => {
    const { accessToken, conversation_id } = values;
    try {
      const response = await axios.get(
        `${MESSAGE_ENDPOINT}/${conversation_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "send/message",
  async (values, { rejectWithValue }) => {
    const { accessToken, conversation_id, message, files } = values;
    try {
      const response = await axios.post(
        MESSAGE_ENDPOINT,
        {
          conversationId: conversation_id,
          message,
          files: files || [],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const chatSlice = createSlice({
  name: "chatState",
  initialState,
  reducers: {
    updateMessages: (state, action) => {
      const conversation = state.activeConversation;

      if (conversation._id === action.payload.conversation._id) {
        state.messages = [...state.messages, action.payload];
      }
      // state.conversations = state.conversations.map((convo) =>
      //   convo._id === action.payload.conversation._id
      //     ? { ...convo, latestMessage: action.payload }
      //     : convo
      // );

      let oldConversation = state.conversations.find(
        (convo) => convo._id === action.payload.conversation._id
      );

      let newConversation = {
        ...oldConversation,
        latestMessage: action.payload,
      };

      let newConversations = [...state.conversations].filter(
        (convo) => convo._id !== newConversation._id
      );

      newConversations.unshift(newConversation);
      state.conversations = newConversations;

      // console.log("update messages", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        // console.log("API Response for conversations:", action.payload);
        state.status = "succeeded";
        state.conversations = action.payload.allConversations;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(createOpenConversation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOpenConversation.fulfilled, (state, action) => {
        // console.log("API Response for conversations:", action.payload);
        state.status = "succeeded";
        state.activeConversation = action.payload.conversation;
      })
      .addCase(createOpenConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(getConversationMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        // console.log("API Response for conversations:", action.payload);
        state.status = "succeeded";
        state.messages = action.payload.messages;
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(sendMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // console.log("API Response for conversations:", action.payload);

        state.status = "succeeded";
        state.messages = [...state.messages, action.payload.message];
        let conversation = {
          ...action.payload.message.conversation,
          latestMessage: action.payload.message,
        };

        let newConversations = [...state.conversations].filter(
          (convo) => convo._id !== conversation._id
        );

        newConversations.unshift(conversation);
        state.conversations = newConversations;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { updateCliked, updateMessages } = chatSlice.actions;
export default chatSlice.reducer;
//
