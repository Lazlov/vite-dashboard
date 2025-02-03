import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowEditStopReasons,
  GridRowModel,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";

import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../Services/Products/productsApiSlice";
import { ProductModal } from "./ProductModal";
import { MenuItem, Select } from "@mui/material";

export const AuthProductList = () => {
  const {
    data: rows = [],
    isSuccess,
    isLoading,
    isFetching,
  } = useGetProductsQuery("productsList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
  });

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    try {
      await deleteProduct(id.toString()).unwrap();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    try {
      await updateProduct({ id: newRow._id, ...newRow }).unwrap();
      console.log("newrow", newRow);
      return newRow;
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const EditRolesCell = (params: GridRenderEditCellParams) => {
    const { id, value, api } = params;
    const handleChange = (event: any) => {
      api.setEditCellValue({ id, field: "status", value: event.target.value });
    };

    return (
      <Select value={value} onChange={handleChange} fullWidth>
        <MenuItem value="active">active</MenuItem>
        <MenuItem value="inactive">inactive</MenuItem>
        <MenuItem value="atchived">archived</MenuItem>
      </Select>
    );
  };


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
    },
    {
      field: 'status',
      headerName: 'Status',
      type: 'singleSelect',
      valueOptions: ['active', 'inactive', 'archived'],
      editable: true,
      width: 150,
      renderEditCell: EditRolesCell, // Use custom edit cell component
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              sx={{ color: "primary.main" }}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ height: "80vh", width: "100%" }}>
     {isSuccess && <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        getRowId={(row) => row._id}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        loading={isLoading || isFetching}
        slots={{
          toolbar: () => <ProductModal />,
        }}
      />}
    </Box>
  );
};
