import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
        setProfilePic(decoded.vid);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Invalid token:", e);
        setIsAuthenticated(false);
        setUsername(null);
        setProfilePic(null);
      }
    }
  }, []);

  const login = (token) => {
    Cookies.set("authToken", token, { expires: 1 });
    try {
      const decoded = jwtDecode(token);
      setIsAuthenticated(true);
      setUsername(decoded.username);
      setProfilePic(decoded.vid);
    } catch (e) {
      console.error("Login token error:", e);
    }
  };

  const logout = () => {
    Cookies.remove("authToken");
    setIsAuthenticated(false);
    setUsername(null);
    setProfilePic(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, profilePic, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
