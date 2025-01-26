import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useRefreshMutation } from "./authApiSlice";
import { selectCurrentToken } from "./authSlice";

export const PersistLogin = () => {
  const [refresh, { isUninitialized, isLoading, isSuccess, isError }] =
    useRefreshMutation();
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh(null);
      } catch (err) {
        console.log(err);
      }
    };
    if (!token) {
      verifyRefreshToken();
    }
  }, []);

  return (
    <>
      {isLoading && <h2>Loading</h2>}
      {isError && (
        <div>Your session time expired. Please log in again</div> //token expaired
      )}
      {token && isUninitialized && <Outlet />}
      {isSuccess && <Outlet />}
    </>
  );
};
