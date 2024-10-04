import React from "react";

import AuthContext from "./AuthContext";

import LoadingScreen from "../components/LoadingScreen";

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [userRole, setUserRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (
      localStorage.getItem("token") &&
      localStorage.getItem("user") &&
      !user &&
      !token
    ) {
      // If token and user are not set in state, but are in localStorage, set them in state
      setToken(localStorage.getItem("token"));
      setUser(JSON.parse(localStorage.getItem("user")));
      setUserRole(JSON.parse(localStorage.getItem("user")).role);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (
      token &&
      userRole &&
      !localStorage.getItem("token") &&
      !localStorage.getItem("user")
    ) {
      // If new user is logged in are in state but are not in localStorage, set them in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [token, user, userRole]);
  const getApiHeadersWithToken = () => {
    // This function returns the headers object with the token for API calls
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  if (loading) {
    return <LoadingScreen />;
  } else {
    return (
      <AuthContext.Provider
        value={{
          token,
          setToken,
          user,
          setUser,
          userRole,
          setUserRole,
          getApiHeadersWithToken,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}
