import { useAuth } from "../Components/useAuth";

export const Profile = () => {
  const { email } = useAuth();
  return <>Profile: {email}</>;
};
