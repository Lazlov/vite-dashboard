import { Typography, Grid } from "@mui/material";
import { useAuth } from "../Components/useAuth";
import { Link, useNavigate } from "react-router-dom";

export const Welcome = () => {
  const { email, isVerified } = useAuth();
  const navigate = useNavigate()
  console.log(isVerified);
  return (
    <Grid
      container
      spacing={1}
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="90vh"
    >
      <Grid item xs={3}>
        <Typography variant="h2">
          <>Welcome {`${email}`}</>
        </Typography>
        <>
          {!isVerified &&
            <Typography variant="body1">
             
              Please <Link to="/d/activate/token">confirm</Link> your email through the link we have sent to your
              email.
            </Typography>

         }
         {isVerified && <></>
         }
        </>
      </Grid>
    </Grid>
  );
};
