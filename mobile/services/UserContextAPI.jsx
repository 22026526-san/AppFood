import {API_URL} from '@env'
import { useUser } from '@clerk/clerk-react';
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import {setCart} from '../redux/cartAction';
import { useDispatch } from 'react-redux';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user_id, setUser] = useState();
  const { user } = useUser()
  const [isSignUp, setIsSignUp] = useState(false);
  const { userId } = useAuth();
  const [name,setName] = useState();
  const [phone,setPhone] = useState();
  const [imgUser,setImgUser] = useState();
  const [role, setRole] = useState();
  const [active, setActive] = useState('');
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
            id : user_id,
            email: user.primaryEmailAddress?.emailAddress,
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

  useEffect(() => {
    const userInfo = async () => {
      try {

        const res = await fetch(`${API_URL}/user/user_info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerkId: userId,
          }),
        });

        const result = await res.json();
      
        setPhone(result.user.phone)
        setUser(result.user.user_id)
        setName(result.user.user_name)
        setImgUser(result.user.img)
        setRole(result.user.role)
        setActive(result.user.user_active)

      } catch (err) {
        console.error('Lỗi khi lấy thông tin user:', err);
      }
    };
    if (userId) {
      userInfo();
    }
  }, [userId]);

  return (
    <UserContext.Provider value={{ user_id, setUser, setIsSignUp ,phone,name,setPhone,setName,imgUser,setImgUser,setRole,role,setActive,active}}>
      {children}
    </UserContext.Provider>
  );
};
