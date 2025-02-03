import { Outlet } from "react-router-dom";
import { Header } from "../Layouts/Header";
import { Box } from "@mui/material";

export const Layout = () => {
  return (
    <Box component="main">
      <Header />
      <Outlet />
    </Box>
  );
};
