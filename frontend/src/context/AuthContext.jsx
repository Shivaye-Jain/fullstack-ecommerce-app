import { createContext, useEffect, useState } from "react";

import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const login = async (token) => {
    localStorage.setItem("token", token);
    await fetchUser();
  }

  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
    setIsAuthenticated(false);
  }

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token){
        setLoading(false);

        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data);

      setIsAuthenticated(true);
    } catch(err){
      console.log(err);

      logout();
    } finally{
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchUser();

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};