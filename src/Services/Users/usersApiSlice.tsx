import { apiSlice } from "../Api/apiSlice";

interface User {
  id: string;
  email: string;
  password?: string;
  roles?: string[];
  isNew?: boolean;
}

interface UserResponse {
  _id: string;
  email: string;
  password: string;
  roles?: string[];
  isNew?: boolean;
}

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<User, Partial<User>>({
      query(body) {
        return {
          url: `/users`,
          method: "POST",
          body,
        };
      },

      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    getUsers: builder.query<UserResponse[], string>({
      query: () => ({
        url: `/users`,

        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,

        keepUnusedDataFor: 60,
      }),
      providesTags: (result): Array<{ type: "User"; id: string }> =>
        result
          ? [
              { type: "User", id: "LIST" },
              ...result.map(({ _id }) => ({ type: "User" as const, id: _id })),
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),
    updateUser: builder.mutation<User, Partial<User> & Pick<User, "id">>({
      query: ({ id, ...patch }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteUser: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id: "LIST" },
        { type: "User", id },
      ],
    }),

    resetPassword: builder.mutation<User, { email: string }>({
      query: (email) => ({
        url: `/reset-password`,
        method: "POST",
        body: email,
      }),
    }),

    newPassword: builder.mutation<User, { password: string; token: string }>({
      query: ({ password, token }) => ({
        url: `/new-password/${token}`,
        method: "PATCH",
        body: { password },
      }),
    }),
  }),
});
export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useResetPasswordMutation,
  useNewPasswordMutation,
} = usersApiSlice;
