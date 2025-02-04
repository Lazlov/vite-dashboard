import { Grid, Button, TextField, Box, Container, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useCreateUserMutation } from "../Services/Users/usersApiSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import React from "react";

export const Registration = () => {
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup
      .string()
      .required("This field is required")
      .min(6, "Password should be at least 6 characters long")
      .max(16, "Password should be at most 16 characters long"),
    password_: yup
      .string()
      .required("This field is required")
      .min(6, "Password should be at least 6 characters long")
      .max(16, "Password should be at most 16 characters long")
      .oneOf([yup.ref("password")], "Both passwords need to be the same"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "", password_: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = await createUser({ email: values.email, password: values.password }).unwrap();
        console.log("fulfilled", payload);
        navigate("/login");
      } catch (error) {
        console.error("rejected", error);
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
          <TextField
            fullWidth
            id="password_"
            name="password_"
            label="Confirm Password"
            type="password"
            margin="normal"
            value={formik.values.password_}
            onChange={formik.handleChange}
            error={formik.touched.password_ && Boolean(formik.errors.password_)}
            helperText={formik.touched.password_ && formik.errors.password_}
          />
          <Button color="primary" variant="contained" fullWidth type="submit" disabled={isCreating} sx={{ mt: 2, mb: 2 }}>
            Sign Up
          </Button>
          <Button component={RouterLink} to="/login" sx={{ textTransform: "none", display: "block", textAlign: "center" }}>
            Already have an account?
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
