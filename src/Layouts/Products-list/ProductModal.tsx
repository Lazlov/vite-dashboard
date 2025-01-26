import * as React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAddProductMutation } from "../../Services/Products/productsApiSlice";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { MenuItem } from "@mui/material";

export const ProductModal: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [addProduct] = useAddProductMutation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <GridToolbarContainer>
        <Button
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Product
        </Button>
      </GridToolbarContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const { product, price, quantity, status } = formJson;

            try {
              console.log({ name: product, price, quantity, status });
              await addProduct({
                name: product,
                price,
                quantity,
                status,
              }).unwrap();
              handleClose();
            } catch (error) {
              console.error("Failed to add product:", error);
            }
          },
        }}
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the details of the product you want to add, including the
            product name, price, and quantity.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="product"
            name="product"
            label="Product"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="price"
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="quantity"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
          />

          <TextField
            sx={{ mt: 3 }}
            required
            margin="dense"
            id="status"
            name="status"
            label="Status"
            select
            defaultValue="inactive"
            fullWidth
            helperText="Select the status of the product"
            variant="standard"
          >
            <MenuItem key="active" value="active">
              Active
            </MenuItem>
            <MenuItem key="inactive" value="inactive">
              Inactive
            </MenuItem>
            <MenuItem key="archived" value="archived">
              Archived
            </MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add Product</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
