import { apiSlice } from "../Api/apiSlice";

interface User {
  id: string;
  email: string;
  password?: string;
  roles?: string[];
  isNew?: boolean;
}

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    confirmUser: builder.mutation<{ token: string }, { token: string }>({
      query: ({ token }) => ({
        url: `email/activate/${token}`,
        method: "PATCH",
      }),
    }),

    resendEmail: builder.mutation<User, { token: string }>({
      query({ token }) {
        return {
          url: `email/resendtoken/${token}`,
          method: "PATCH",
        };
      },
    }),
  }),
});
export const { useConfirmUserMutation, useResendEmailMutation } = usersApiSlice;
