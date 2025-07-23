import {API_URL} from '@env'
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    const updateUser = async () => {
      try {

        const res = await fetch(`${API_URL}/signup_update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            flerkId: userId,
            id : user
          }),
        });

        const result = await res.json();
        console.log(result)
        console.log(userId);
        console.log(user)
        if (result.success) {
          setIsSignUp(false);
        }

      } catch (err) {
        console.error('Lỗi khi cập nhật user:', err);
      }
    };
    if (isSignUp && userId) {
      updateUser();
    }
  }, [isSignUp, userId]);

  return (
    <UserContext.Provider value={{ user, setUser, setIsSignUp }}>
      {children}
    </UserContext.Provider>
  );
};
