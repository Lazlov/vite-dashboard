import { Button } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Components/useAuth";
import { useLogOutMutation } from "../Services/Auth/authApiSlice";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import React from "react";

export const Header = () => {
  const { isUser, isAdmin, email } = useAuth();
  const navigate = useNavigate();
  const [logOut] = useLogOutMutation();
  const logOutHandler = async () => {
    try {
      await logOut(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
   
  };

  return (
    <>
      <AppBar component="nav" position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <div>
            {(!isUser || !isAdmin) && (
              <IconButton color="inherit" component={RouterLink} to="/">
                <HomeIcon />
              </IconButton>
            )}
            {isAdmin && (
              <Button color="inherit" component={RouterLink} to="/d/users">
                users
              </Button>
            )}
          </div>

          <Box display="flex" sx={{ alignItems: "center" }}>
            {" "}
            {!isUser && !isAdmin && (
              <Button color="inherit" component={RouterLink} to="/login">
                login
              </Button>
            )}
            {!isUser && !isAdmin && (
              <Button color="inherit" component={RouterLink} to="/registration">
                registration
              </Button>
            )}
            {(isUser || isAdmin) && (
              <Button color="inherit" component={RouterLink} to="/d/profile">
                {email}
              </Button>
            )}
            {(isAdmin || isUser) && (
              <IconButton
                sx={{ mr: 2 }}
                color="inherit"
                onClick={() => logOutHandler()}
              >
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Exit{" "}
                </Typography>
                <ExitToAppIcon sx={{ ml: 1 }} />{" "}
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* mui docs -> second Toolbar to fix main content overlaping */}
      <Toolbar />
    </>
  );
};
