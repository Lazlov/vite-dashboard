import { Navigate, Route, Routes } from "react-router-dom";
import { PublicHome } from "./Layouts/Home/PublicHome";
import { AuthHome } from "./Layouts/Home/AuthHome";
import { Login } from "./Pages/Login";
import { Registration } from "./Pages/Registration";
import { RequireAuth } from "./Layouts/RequireAuth";
import { Welcome } from "./Pages/Welcome";
import { UsersList } from "./Layouts/Users-list/UsersList";
import { Auth } from "./Layouts/Auth";
import { PersistLogin } from "./Services/Auth/PersistLogin";
import { Layout } from "./Pages/Layout";
import { Profile } from "./Pages/Profile";
import { ActivateUserLink } from "./Pages/ActivateUserLink";
import { ActivateUser } from "./Pages/ActivateUser";
import { PasswordReset } from "./Pages/PasswordReset";
import { NewPassword } from "./Pages/NewPassword";
import { NotFound } from "./Pages/NotFound";
import RequireUnauth from "./Components/RequireUnauth";
import { RequireVerify } from "./Layouts/RequireVerify";

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Layout />}>
          {/* Public */}
          <Route element={<RequireUnauth />}>
            <Route path="/" element={<PublicHome />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/new-password/:token" element={<NewPassword />} />
          {/* Auth */}
          <Route element={<PersistLogin />}>
            <Route path="/d" element={<Auth />}>
              <Route
                element={
                  <RequireAuth allowedRoles={["user", "manager", "admin"]} />
                }
              >
                 <Route index element={<Navigate to="welcome" replace />} /> {/* Redirect */}
                <Route path="activate" element={<ActivateUser />} />
                <Route
                    path="activate/:token"
                    element={<ActivateUserLink />}
                  />
                <Route element={<RequireVerify />}>
                  <Route path="welcome" element={<Welcome />} />
                 

                  <Route path="profile" element={<Profile />} />

                  <Route element={<RequireAuth allowedRoles={["user"]} />}>
                    <Route path="user-home" element={<PublicHome />} />
                  </Route>

                  <Route
                    element={
                      <RequireAuth allowedRoles={["manager", "admin"]} />
                    }
                  >
                    <Route path="private-home" element={<AuthHome />} />
                  </Route>

                  <Route element={<RequireAuth allowedRoles={["admin"]} />}>
                    <Route path="users" element={<UsersList />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};
