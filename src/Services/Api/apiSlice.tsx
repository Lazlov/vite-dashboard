import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenReceived, logOut} from "../Auth/authSlice";
import { RootState } from "../store";
import { TokenResponse, AuthApiState } from "./auth";

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery("/refresh", api, extraOptions);
    console.log(refreshResult);
    if (refreshResult.data) {
      const token = refreshResult.data as TokenResponse;

      const email = (api.getState() as AuthApiState).user.email;

      api.dispatch(tokenReceived({ token, user: { email } }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut()); //
      if (refreshResult?.error?.status === 403) {
        console.log("Your login has expired.");
      }
      return refreshResult;
    }
  }
  return result;
};



export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "User"],
  endpoints: (builder) => ({}),
});


