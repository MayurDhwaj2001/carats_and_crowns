import { Add_to_cart, Remove_from_cart, Update_cart, Clear_cart, Replace_cart } from "./CartActionType";
import axios from 'axios';

const saveCartToBackend = async (item, token, action) => {
  if (!token) return;
  try {
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    switch (action) {
      case 'add':
        await axios.post('http://localhost:5000/api/cart', {
          userId,
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        });
        break;
      case 'update':
        if (item.cartId) {
          await axios.put(`http://localhost:5000/api/cart/${item.cartId}`, {
            quantity: item.quantity
          });
        }
        break;
      case 'remove':
        if (item.cartId) {
          await axios.delete(`http://localhost:5000/api/cart/${item.cartId}`);
        }
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export const CartReducer = (state = [], action) => {
  let newState;
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  switch (action.type) {
    case Add_to_cart:
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        newState = state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        saveCartToBackend({ 
          ...existingItem, 
          quantity: existingItem.quantity + action.payload.quantity 
        }, token, 'update');
      } else {
        const newItem = { ...action.payload };
        newState = [...state, newItem];
        saveCartToBackend(newItem, token, 'add');
      }
      return newState;

    case Update_cart:
      newState = state.map((item) =>
        item.id === action.payload.id ? { ...item, ...action.payload } : item
      );
      saveCartToBackend(action.payload, token, 'update');
      return newState;

    case Remove_from_cart:
      // Now action.payload contains both id and cartId
      saveCartToBackend(action.payload, token, 'remove');
      return state.filter((item) => item.id !== action.payload.id);

    case Clear_cart:
      if (token) {
        state.forEach(item => {
          if (item.cartId) {
            saveCartToBackend({ cartId: item.cartId }, token, 'remove');
          }
        });
      }
      return [];

    case Replace_cart:
      return action.payload;

    default:
      return state;
  }
};
