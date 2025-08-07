// src/redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addItemToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.findIndex(i => i.food_id === item.food_id);
      if (existingItem !== -1) {
        state.items[existingItem].quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.findIndex(i => i.food_id === item.food_id);
      if (state.items[existingItem].quantity > 1) {
        state.items[existingItem].quantity -= 1;
      } else if (state.items[existingItem].quantity === 1) {
        state.items.splice(existingItem, 1);
      }
    },
    addFoodToCart: (state, action) => {
      const { item, count } = action.payload;
      const existingItem = state.items.findIndex(i => i.food_id === item.food_id);
      if (existingItem === -1) {
        const limitedPayload = Object.fromEntries(Object.entries(item).slice(0, 4));
        state.items.push({ ...limitedPayload, quantity: count })
      } else {
        state.items[existingItem].quantity += count;
      }
    },
    setCart: (state, action) => {
      state.items = action.payload;
    },
    removeCart: (state, action) => {
      state.items = state.items.filter(i => i.food_id !== action.payload);
    },
    re_orders: (state, action) => {
      const cart = action.payload.map(({ unit_price, ...rest }) => ({
        ...rest,
        price: unit_price,
      }));
      state.items = cart; 
    }
    
  }
});

export const { addItemToCart, removeFromCart, addFoodToCart, setCart, removeCart ,re_orders} = cartSlice.actions;
export default cartSlice.reducer;
