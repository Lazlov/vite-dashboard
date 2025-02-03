import React, { useState } from "react";
import { TextField, Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2/"
import { useFormik } from "formik";
import * as yup from "yup";

import { useNavigate } from "react-router-dom";

import LoadingButton from "@mui/lab/LoadingButton";
import { useResetPasswordMutation } from "../Services/Users/usersApiSlice";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export const PasswordReset = () => {
  const [resetPassword, { data, isLoading }] = useResetPasswordMutation();
  const [linkSent, setLinkSent] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        await resetPassword(values).unwrap();
        setLinkSent(true);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Container component="section">
      <Box component="form" method="POST" onSubmit={formik.handleSubmit}>
        {linkSent && (
          <Grid
            container
            height="90vh"
            spacing={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            A link to change your password was sent to {formik.values.email}
          </Grid>
        )}
        {!linkSent && (
          <Grid
            container
            height="90vh"
            spacing={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid xs={6}>
              <Typography variant="h6" textAlign="center">
                Enter your email so that we can send you a reset password link
              </Typography>
            </Grid>

            <Grid xs={3}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            <Grid xs={3}>
              <LoadingButton
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                loading={isLoading}
              >
                Confirm
              </LoadingButton>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

