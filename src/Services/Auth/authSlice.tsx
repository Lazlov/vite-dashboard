import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User, TokenResponse, AuthState } from "../Api/auth";
import type { PayloadAction } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null } as AuthState,
  reducers: {
    tokenReceived: (
      state,
      {
        payload: { user, token },
      }: PayloadAction<{ user: User; token: TokenResponse }>
    ) => {
      state.user = user;
      state.token = token;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { tokenReceived, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
