import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetails: null
}

/*
userDetails shape: 
  userName: string,
  userId: string,
  email: string,
  token: string,
  participatedRoom: object
*/

const UserDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.userDetails = action.payload ?? null;
      console.log(action.payload);
    },
    updateToken: (state, action) => {
      state.userDetails.token = action.payload;
      console.log(action.payload);
    },
  }
});

export const { updateToken, updateUser } = UserDetailsSlice.actions;
export const userDetailsSelector = (state) => state.user.userDetails;
export default UserDetailsSlice.reducer;