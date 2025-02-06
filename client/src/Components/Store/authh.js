import { createContext, useContext, useState, useEffect } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [userID, setUserID] = useState("");
 
  let isLoggedIn = !!token;
 
  useEffect(() => {
    const storedToken = TokenFROMLSGet();
    const storedUserID = UserIDFROMLSGet(); // Get user ID from localStorage
    console.log("Stored UserID from localStorage:", storedUserID);
  
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUserID) {
      setUserID(storedUserID); // Store it in state
    }
  }, []);

  //function to stored the token in local storage Importtant
  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };
  const storeUserIDInLS = (serverUserid) => {
    setUserID(serverUserid);
    return localStorage.setItem("userid", serverUserid);
  };
  const UserIDFROMLSGet = () => {
    return localStorage.getItem("userid");
  };
  const TokenFROMLSGet = () => {
    return localStorage.getItem("token");
  };

 

  // Function to clear token and user ID from local storage (logout)
  const logout = () => {
    setToken("");
    setUserID("");
   

    localStorage.removeItem("token");
    localStorage.removeItem("userid");
  };

  return (
    <AuthContext.Provider
      value={{  
        TokenFROMLSGet,
        isLoggedIn,
        storeTokenInLS,
        storeUserIDInLS,
        UserIDFROMLSGet,
        logout,
        token,
        userID,


      
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};
