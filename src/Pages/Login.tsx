import { Grid, Button, TextField, Box, Container, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAppDispatch } from "../Services/hooks";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useLoginMutation } from "../Services/Auth/authApiSlice";
import { tokenReceived } from "../Services/Auth/authSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import React from "react";

const validationSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password should be at least 8 characters long")
    .max(16, "Password should be at most 16 characters long")
    .required("Password is required"),
});

export const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isFetchBaseQueryError = (error) => {
    return typeof error === "object" && error !== null && "status" in error && "data" in error;
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        const token = await login(values).unwrap();
        dispatch(tokenReceived({ token, user: { email: values.email } }));
        navigate("/d/welcome");
      } catch (error) {
        if (isFetchBaseQueryError(error)) {
          if (error.status === 404) {
            setFieldError("email", "User with that email doesn't exist");
          } else if (error.status === 400) {
            setFieldError("password", "Wrong password");
          } else {
            setFieldError("email", "An unexpected error occurred. Please try again.");
          }
        }
      }
    },
  });

  return (
    <Container maxWidth="xs" sx={{ display: "flex", height: "90vh", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%" }}>
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
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <LoadingButton
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            loading={isLoading}
            sx={{ mt: 2, mb: 2 }}
          >
            Sign In
          </LoadingButton>
          <Button component={RouterLink} to="/password-reset" sx={{ textTransform: "none", display: "block", textAlign: "center" }}>
            Forgot password?
          </Button>
        </Box>
      </Box>
    </Container>
  );
};