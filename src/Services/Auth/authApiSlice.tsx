import { apiSlice } from "../Api/apiSlice";
import { LoginRequest, TokenResponse } from "../Api/auth";
import { logOut, tokenReceived } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "post",
        body: { ...credentials },
      }),
    }),

    logOut: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "post",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);

          dispatch(logOut());

          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("its data", data);

          dispatch(
            tokenReceived({
              token: data.generateAccessToken,
              user: { email: data.email },
            })
          );
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogOutMutation, useRefreshMutation } =
  authApiSlice;
