import React, { useEffect, useState } from "react";
import {
  useConfirmUserMutation,
  useResendEmailMutation,
} from "../Services/Email/verifyApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../Components/useAuth";
import { useRefreshMutation } from "../Services/Auth/authApiSlice";
import { tokenReceived } from "../Services/Auth/authSlice";
import { useAppDispatch } from "../Services/hooks";

export const ActivateUserLink = () => {
  const dispatch = useAppDispatch();
  const [
    confirmUser,
    {
      isLoading: isConfirmLoading,
      isSuccess: isConfirmSuccess,
      isError: isConfirmError,
    },
  ] = useConfirmUserMutation();
  const [
    resendEmail,
    { isLoading: isResendLoading, isSuccess: isResendSuccess },
  ] = useResendEmailMutation();

  const [send, setSend] = useState(false);
  const { token } = useParams();
  const { email } = useAuth();
  const navigate = useNavigate();
  const [refresh, { isUninitialized, isLoading, isSuccess, isError }] =
    useRefreshMutation();

  const confirmEmail = async () => {
    if (!token) {
      console.error("No token found in URL params");
      return;
    }

    try {
      const newToken = await confirmUser({ token }).unwrap();

      dispatch(tokenReceived({ token: newToken, user: { email } }));
      navigate("/d/welcome");
    } catch (error) {
      console.error("Error confirming user:", error);
    }
  };

  useEffect(() => {
    confirmEmail();
  }, []);

  const handleResend = async () => {
    if (!token) {
      console.error("No token found in URL params");
      return;
    }

    try {
      await resendEmail({ token }).unwrap();
      setSend(true);
      console.log("Activation link resent successfully");
    } catch (error) {
      console.error("Error resending email:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Please confirm your email to gain full access.
      </Typography>

      {isConfirmLoading ? (
        <CircularProgress />
      ) : isConfirmSuccess ? (
        <Typography variant="body1" color="primary">
          Your account has been successfully activated.
        </Typography>
      ) : isConfirmError ? (
        <>
          <Typography variant="body1" color="error">
            Your activation link has expired or is invalid.
          </Typography>
          {!send && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleResend}
              disabled={isResendLoading}
            >
              {isResendLoading ? "Resending..." : "Resend Email"}
            </Button>
          )}
        </>
      ) : null}

      {send && (
        <Typography variant="body2" color="success">
          A new activation link has been sent to {email}.
        </Typography>
      )}
    </div>
  );
};
