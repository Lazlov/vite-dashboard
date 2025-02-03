import { Button, TextField, Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid2/"; // Note the updated import for Grid2
import { useFormik } from "formik";
import * as yup from "yup";
import { useCreateUserMutation } from "../Services/Users/usersApiSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";

export const Registration = () => {
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup
      .string()
      .required("This field is required")
      .min(6, "Password should be of minimum 6 characters length")
      .max(16, "Password should be of maximum 16 characters length"),
    password_: yup
      .string()
      .required("This field is required")
      .min(6, "Password should be of minimum 6 characters length")
      .max(16, "Password should be of maximum 16 characters length")
      .when("password", {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf([yup.ref("password")], "Both passwords need to be the same"),
      }),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      password_: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = await createUser({
          email: values.email,
          password: values.password,
        }).unwrap();
        console.log("fulfilled", payload);
      } catch (error) {
        console.error("rejected", error);
      } finally {
        navigate("/login");
      }
    },
  });

  return (
    <Container component="section">
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid
          container
          height="90vh"
          spacing={2}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid xs={12}>
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
          <Grid xs={12}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              fullWidth
              id="password_"
              name="password_"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={formik.values.password_}
              onChange={formik.handleChange}
              error={formik.touched.password_ && Boolean(formik.errors.password_)}
              helperText={formik.touched.password_ && formik.errors.password_}
            />
          </Grid>
          <Grid xs={12}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              disabled={isCreating}
            >
              Submit
            </Button>
          </Grid>
          <Grid xs={12}>
            <Button
              sx={{ textTransform: "none" }}
              color="primary"
              component={RouterLink}
              to="/login"
            >
              Already have an account?
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};