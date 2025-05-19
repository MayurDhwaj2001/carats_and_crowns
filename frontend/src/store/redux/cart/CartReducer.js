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

const initialState = {
  items: [],
  total: 0
};

export const CartReducer = (state = initialState, action) => {
  let newState;
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  switch (action.type) {
    case Add_to_cart:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, action.payload]
        };
      }
      saveCartToBackend(action.payload, token, 'add');
      break;

    case Remove_from_cart:
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };
      saveCartToBackend(action.payload, token, 'remove');
      break;

    case Update_cart:
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
      saveCartToBackend(action.payload, token, 'update');
      break;

    case Clear_cart:
      newState = initialState;
      break;

    case Replace_cart:
      newState = {
        ...state,
        items: action.payload
      };
      break;

    default:
      return state;
  }

  // Calculate total after state changes
  newState.total = newState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return newState;
};
