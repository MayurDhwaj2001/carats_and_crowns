import { Add_to_cart, Remove_from_cart, Update_cart } from "./CartActionType";

const initalCartStage = {
  cart: [],
};

const CartReducer = (state = initalCartStage, action) => {
  switch (action.type) {
    case Add_to_cart:
      const existingItemIndex = state.cart.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedCart = state.cart.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: action.payload.quantity,
              total: action.payload.total
            };
          }
          return item;
        });
        return {
          ...state,
          cart: updatedCart
        };
      }
      // Add new item
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case Update_cart:
      const { id, quantity, price } = action.payload;
      const newcart = state.cart.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: quantity, total: quantity * price };
        }
        return item;
      });
      return {
        ...state,
        cart: newcart,
      };
    case Remove_from_cart:
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
};

export { CartReducer };
