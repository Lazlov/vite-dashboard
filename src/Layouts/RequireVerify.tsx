import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Components/useAuth";
import { selectCurrentToken } from "../Services/Auth/authSlice";
import { useAppSelector } from "../Services/hooks";

export const RequireVerify: React.FC = () => {
  const token = useAppSelector(selectCurrentToken);
  const { isVerified } = useAuth();

  if (!isVerified) {
    return <Navigate to="/d/activate" replace />;
  }

  return <Outlet />;
};
