import React, { useEffect, useState } from "react";
import {
  useConfirmUserMutation,
  useResendEmailMutation,
} from "../Services/Email/verifyApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { useAuth } from "../Components/useAuth";

export const ActivateUser = () => {
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

      {send && (
        <Typography variant="body2" color="success">
          A new activation link has been sent to {email}.
        </Typography>
      )}
    </div>
  );
};
