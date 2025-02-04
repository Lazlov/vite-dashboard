import { Grid, TextField, Box, Container, Typography } from "@mui/material";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { useResetPasswordMutation } from "../Services/Users/usersApiSlice";
import React from "react";

const validationSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
});

export const PasswordReset = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [linkSent, setLinkSent] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await resetPassword(values).unwrap();
        setLinkSent(true);
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <Container maxWidth="xs" sx={{ display: "flex", height: "90vh", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        {linkSent ? (
          <Typography variant="h6" textAlign="center">
            A link to change your password was sent to {formik.values.email}
          </Typography>
        ) : (
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%" }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
              Reset Password
            </Typography>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              margin="normal"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <LoadingButton
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              loading={isLoading}
              sx={{ mt: 2 }}
            >
              Confirm
            </LoadingButton>
          </Box>
        )}
      </Box>
    </Container>
  );
};
