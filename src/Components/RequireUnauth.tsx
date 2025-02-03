import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../Services/hooks";
import { selectCurrentToken } from "../Services/Auth/authSlice";

const RequireUnauth = () => {
  const token = useAppSelector(selectCurrentToken);

  if (token) {
    return <Navigate to="/d/user-home" replace />;
  }

  return <Outlet />;
};

export default RequireUnauth;
