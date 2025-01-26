import { apiSlice } from "../Api/apiSlice";

interface Product {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
}

interface ProductResponse {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
}

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductResponse[], string>({
      query: () => ({
        url: `/products`,
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,

        keepUnusedDataFor: 60,
      }),

      providesTags: (result): Array<{ type: "Product"; id: string }> =>
        result
          ? [
              { type: "Product", id: "LIST" },
              ...result.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),
    addProduct: builder.mutation<Product, Partial<Product>>({
      query(body) {
        return {
          url: `/products`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation<
      Product,
      Partial<Product> & Pick<Product, "id">
    >({
      query: ({ id, ...updatedProduct }) => ({
        url: `products/${id}`,
        method: "PATCH",
        body: updatedProduct,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    deleteProduct: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;
