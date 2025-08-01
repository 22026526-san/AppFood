import {API_URL} from '@env'
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import {setCart} from '../redux/cartAction';
import { useDispatch } from 'react-redux';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isSignUp, setIsSignUp] = useState(false);
  const { userId } = useAuth();
  const [name,setName] = useState();
  const [phone,setPhone] = useState();
  const [imgUser,setImgUser] = useState();
  const dispatch = useDispatch();

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

  useEffect(() => {
    const setUserCart = async () => {
      try {

        const res = await fetch(`${API_URL}/user/set_cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerkId: userId,
          }),
        });

        const result = await res.json();
      
        if (result.success) {
            dispatch(setCart(result.message[0]));
        }

      } catch (err) {
        console.error('Lỗi khi cập nhật cart:', err);
      }
    };
    if (userId) {
      setUserCart();
    }
  }, [userId]);


  return (
    <UserContext.Provider value={{ user, setUser, setIsSignUp ,phone,name,setPhone,setName,imgUser,setImgUser}}>
      {children}
    </UserContext.Provider>
  );
};
