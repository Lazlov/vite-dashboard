import React from "react";
import { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from "../../Services/Users/usersApiSlice";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowModesModel,
  GridRowModes,
  GridRowEditStopReasons,
  GridRenderEditCellParams,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Box, Select, MenuItem } from "@mui/material";

export const UsersList = () => {
  const { data: rows = [], isLoading, isFetching, isSuccess } = useGetUsersQuery('userList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
  });

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
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
      await deleteUser(id.toString()).unwrap();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    try {
      await updateUser({ id: newRow._id, ...newRow }).unwrap();
      return newRow;
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Custom component to manually opening dropdown
  const EditRolesCell = (params: GridRenderEditCellParams) => {
    const { id, value, api } = params;
    const handleChange = (event: any) => {
      api.setEditCellValue({ id, field: "roles", value: event.target.value });
    };

    return (
      <Select value={value} onChange={handleChange} fullWidth>
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="manager">Manager</MenuItem>
      </Select>
    );
  };

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 150 },
    { field: 'email', headerName: 'Username', editable: true, width: 150 },
    {
      field: 'roles',
      headerName: 'Roles',
      type: 'singleSelect',
      valueOptions: ['admin', 'user', 'manager'],
      editable: true,
      width: 150,
      renderEditCell: EditRolesCell, // Use custom edit cell component
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
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
      {isSuccess && (
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          loading={isLoading || isFetching}
        />
      )}
    </Box>
  );
};