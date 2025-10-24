import { createSlice } from "@reduxjs/toolkit";

const getInitialLikes = () => {
  if (typeof window == "undefined") {
    return [];
  } else {
    return JSON.parse(localStorage.getItem("likes") || "[]");
  }
};
const getInitialCart = () => {
  if (typeof window == "undefined") {
    return [];
  } else {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  }
};

const initialState = {
  likedItems: getInitialLikes(),
  cartItems: getInitialCart(),
};

const clientState = createSlice({
  name: "clientState",
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const id = action.payload;
      if (state.likedItems.includes(id)) {
        state.likedItems = state.likedItems.filter(
          (item: number) => item !== id
        );
      } else {
        state.likedItems.push(id);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("likes", JSON.stringify(state.likedItems));
      }
    },
    toggleCart: (state, action) => {
      const id = action.payload;
      if (state.cartItems.includes(id)) {
        state.cartItems = state.cartItems.filter((item: number) => item !== id);
      } else {
        state.cartItems.push(id);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },
  },
});

export const { toggleLike, toggleCart } = clientState.actions;
export default clientState.reducer;
