import {Grid, Button, TextField, Box,  Container } from "@mui/material";
// import Grid from "@mui/material/Grid2";
// import Grid from "@mui/material"

import { useFormik } from "formik";
import * as yup from "yup";
import { useAppDispatch } from "../Services/hooks";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useLoginMutation } from "../Services/Auth/authApiSlice";
import { tokenReceived } from "../Services/Auth/authSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password should be of minimum 8 characters length")
    .max(16, "Password should be of maximum 16 characters length")
    .required("Password is required"),
});

export const Login = () => {
  const [login, { data, isLoading, isError, error }] = useLoginMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isFetchBaseQueryError = (
    error: unknown
  ): error is FetchBaseQueryError => {
    return (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      "data" in error
    );
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, formikHelpers) => {
      try {
        const token = await login(values).unwrap();

        dispatch(tokenReceived({ token, user: { email: values.email } }));

        navigate("/d/welcome");
        
      } catch (error) {
        console.log(error);

        if (isFetchBaseQueryError(error)) {
          if (error.status === 404) {
            formikHelpers.setFieldError(
              "email",
              "User with that email doesn't exist"
            );
          } else if (error.status === 400) {
            formikHelpers.setFieldError("password", "Wrong password");
          } else {
            formikHelpers.setFieldError(
              "email",
              "An unexpected error occurred. Please try again."
            );
          }
        } else {
          console.error("Unexpected error structure:", error);
        }
      }
    },
  });

  return (
    <Container component="section">
      <Box component="form" method="POST" onSubmit={formik.handleSubmit}>
        <Grid
          container
          height="90vh"
          spacing={2}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
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
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
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

          <Button
            sx={{ textTransform: "none" }}
            color="primary"
            component={RouterLink}
            to="/password-reset"
          >
            Forgot password?
          </Button>
        </Grid>
      </Box>
    </Container>
  );
};
