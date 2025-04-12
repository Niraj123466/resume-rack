import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(null); // 👈 default to null

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setCredits(userData.credits ?? 5); // fallback to 5 only if missing in DB
          } else {
            // If user doc doesn't exist, create it with default credits
            await updateDoc(docRef, { credits: 5 });
            setCredits(5);
          }
        } catch (error) {
          console.error("Error loading user credits:", error);
          setCredits(0); // safe fallback
        }
      } else {
        setUser(null);
        setCredits(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const decrementCredits = async () => {
    if (!user || credits === null) return;
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
