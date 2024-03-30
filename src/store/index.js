import { configureStore } from "@reduxjs/toolkit";
import UserDetailsSliceReducer from "./slices/UserDetailsSlice";
import { UserAuthApiSlice } from "../api/UserAuthApi";
import { messageApi } from "../api/MessageApi";

export const store = configureStore({
  reducer: {
    user: UserDetailsSliceReducer,
    [UserAuthApiSlice.reducerPath]: UserAuthApiSlice.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
  },
  middleware: (gDM) => gDM().concat(UserAuthApiSlice.middleware, messageApi.middleware),
});
