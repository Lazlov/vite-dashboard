import { Outlet } from "react-router-dom";
import { useAuth } from "../Components/useAuth";

interface RequireAuthProps {
  allowedRoles: string[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const { roles } = useAuth();

  const hasAccess = allowedRoles.some((role) => roles.includes(role));
  if (!hasAccess) {
    return <>no access</>;
  } else {
    return <Outlet />;
  }
};
