import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

function AuthStatus() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log('User logged in:', currentUser);
      } else {
        setUser(null);
        console.log('User logged out');
      }
    });

    return () => unsub(); // Cleanup
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out!');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
}

export default AuthStatus;