import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import NotFound from "../pages/NotFound/NotFound";
import LoadingScreen from "./LoadingScreen";

import AuthContext from "../context/AuthContext";

import axios from "../config/axios";
import { menuList } from "../utils/menuList";

const ProtectedRoute = ({ children }) => {
  const { user, token, getApiHeadersWithToken, userRole } =
    React.useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user === null || token === null) {
      setLoading(null);
    } else {
      const verifyToken = async () => {
        try {
          // Verify's if token is valid or expired
          const { data } = await axios.get(
            "/verifyAccessToken",
            getApiHeadersWithToken()
          );

          if (data.error === "invalid access token") {
            console.log("Invalid token");
            localStorage.clear();
            navigate("/login", {
              state: { isTokenExpired: true },
            });
          }
        } catch (error) {
          if (error?.response?.data.error === "invalid access token") {
            console.log("Invalid token");
            localStorage.clear();
            navigate("/login", {
              state: { isTokenExpired: true },
            });
          }
        }
      };
      verifyToken();

      // Check's if user with given role is allowed to access the route
      const isAllowedUserRole = menuList
        .find((menu) => menu.route === location.pathname)
        ?.allowedRoles?.includes(userRole);
      if (!isAllowedUserRole) setLoading(null);
      else setLoading(false);
    }
  }, [
    setLoading,
    navigate,
    location,
    token,
    user,
    userRole,
    getApiHeadersWithToken,
  ]);

  if (loading === null) return <NotFound />;
  else if (loading) return <LoadingScreen />;
  return <>{children}</>;
};

export default ProtectedRoute;
