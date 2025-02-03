import React, { useState } from "react";

import {  TextField, Box, Container, Typography } from "@mui/material";
// import Grid from "@mui/material/Grid2/"
import Grid from "@mui/material"

import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import LoadingButton from "@mui/lab/LoadingButton";
import { useNewPasswordMutation } from "../Services/Users/usersApiSlice";

const validationSchema = yup.object({
  password: yup
    .string()
    .min(6, "Password should be of minimum 8 characters length")
    .max(16, "Password should be of maximum 16 characters length")
    .required("Password is required"),
});

export const NewPassword = () => {
  const [newPassword, { data, isLoading }] = useNewPasswordMutation();
  const [passwordChanged, setPasswordChanged] = useState(false);

  const { token } = useParams<{ token: string }>();
  if (!token) {
    throw new Error("Token is missing from the URL.");
  }

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        console.log(values.password);
        await newPassword({ password: values.password, token }).unwrap();
        setPasswordChanged(true);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Container component="section">
      {passwordChanged && (
        <Grid
          container
          height="90vh"
          spacing={2}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          Password was changed
        </Grid>
      )}
      {!passwordChanged && (
        <Box component="form" method="POST" onSubmit={formik.handleSubmit}>
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
                Enter your new password
              </Typography>
            </Grid>
            <Grid xs={3}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
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
                Submit
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};
