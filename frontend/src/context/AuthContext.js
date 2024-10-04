import React from "react"

const AuthContext = React.createContext({
  token: null,
  setToken: () => {},
  getApiHeadersWithToken: () => {},
  userRole: null,
  setUserRole: () => {},
  user: null,
  setUser: () => {}
})

export default AuthContext;