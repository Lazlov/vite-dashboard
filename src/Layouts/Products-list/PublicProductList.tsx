import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

import { useGetProductsQuery } from "../../Services/Products/productsApiSlice";

export const PublicProductList = () => {
  const {
    data: rows = [],
    isLoading,
    isFetching,
  } = useGetProductsQuery("productsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
  });

  const columns: GridColDef[] = [
    
    {
      field: "name",
      headerName: "Product",
      flex: 1,
      editable: true,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      editable: true,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      editable: true,
    },]

  return (
    <Box sx={{ height: "80vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id}
        loading={isLoading || isFetching}
      />
    </Box>
  );
};
