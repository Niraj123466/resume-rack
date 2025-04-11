import { createContext, useEffect, useState, useContext } from "react";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";



const AuthContext = createContext();



export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);



  useEffect(() => {

    const unsub = onAuthStateChanged(auth, (currentUser) => {

      setUser(currentUser);

    });

    return () => unsub();

  }, []);



  return (

    <AuthContext.Provider value={{ user }}>

      {children}

    </AuthContext.Provider>

  );

};



// Custom hook to use auth

export const useAuth = () => useContext(AuthContext);