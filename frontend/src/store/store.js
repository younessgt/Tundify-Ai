import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { userSlice } from "../features/userSlice";
import { createFilter } from "redux-persist-transform-filter";
import { createTransform } from "redux-persist";
import { userSlice } from "../features/userSlice";
import { chatSlice } from "../features/chatSlice";

// filter configuration
const SaveOnlyUserFilter = createFilter("userState", ["user"]);

// const userTransform = createTransform(
//   // Transform the state being persisted
//   (inboundState) => {
//     // Return only the user object, exclude status and error
//     return { user: { ...inboundState.user } };
//   },
//   // Transform the state being rehydrated
//   (outboundState) => {
//     // Only keep the user object, no status or error
//     return { user: { ...outboundState.user } };
//   },
//   {
//     whitelist: ["userState"], // This should match the key in your reducer
//   }
// );

//  persist configuration
const persistConfig = {
  key: "userState",
  // key: "root",
  storage,
  whitelist: ["userState"],
  transforms: [SaveOnlyUserFilter],
};

// root reducer
const rootReducer = combineReducers({
  userState: userSlice.reducer,
  chatState: chatSlice.reducer,
});

//2  persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export const persistor = persistStore(store);

// what we have done here is to create a store that will persist the user data in the local storage of the browser.
// so that when the user refreshes the page, the user data will still be available.
// we have used redux-persist to achieve this.
// we have also used redux-persist-transform-filter to filter the data that we want to persist.
// we have created a filter that will only persist the user data.
// we have also used reduxjs/toolkit to create the store and the reducer.
// we have used combineReducers to combine the reducers.
