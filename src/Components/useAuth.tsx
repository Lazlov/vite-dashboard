import jwtDecode, { JwtPayload } from "jwt-decode";
import { selectCurrentToken } from "../Services/Auth/authSlice";
import { useSelector } from "react-redux";
import { TokenResponse } from "../Services/Api/auth";

interface decodedToken {
  roles:string[],
  _id:string,
  email:string,
  isVerified:boolean}

export const useAuth = () => {
  const token = useSelector(selectCurrentToken) as TokenResponse
  let isAdmin = false;
  let isManager = false;
  let isUser = false;
  let isVerified = false;
  let status = "guest";

  if (token) {
    const decodedToken: decodedToken = jwtDecode(token.toString()) 
    let { _id, roles, email, isVerified} = decodedToken;
    const isUser = roles.includes("user");
    const isManager = roles.includes("manager");
    const isAdmin = roles.includes("admin");
    
    if(isUser) status= "user"
    if(isManager) status="manager"
    if(isAdmin) status="admin"
    return { _id, email, status, isVerified, roles, isUser, isAdmin };
  }
  return { _id: " ", email: " ",roles:[], isVerified, isUser, isAdmin, isManager, status };
};
