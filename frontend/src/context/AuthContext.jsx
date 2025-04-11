import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(5); // default credits

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCredits(docSnap.data().credits || 5);
        }
      } else {
        setUser(null);
        setCredits(5);
      }
    });

    return () => unsubscribe();
  }, []);

  const decrementCredits = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const newCredits = Math.max(credits - 1, 0);
    await updateDoc(docRef, { credits: newCredits });
    setCredits(newCredits);
  };

  return (
    <AuthContext.Provider value={{ user, credits, setCredits, decrementCredits }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
