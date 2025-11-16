import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ClientState = {
  likedItems: number[];
  cartItems: number[];
};

const parseStoredItems = (storageKey: string): number[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const storedValue = localStorage.getItem(storageKey);
  if (!storedValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(storedValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is number => typeof item === "number");
  } catch {
    return [];
  }
};

const initialState: ClientState = {
  likedItems: parseStoredItems("likes"),
  cartItems: parseStoredItems("cart"),
};

const clientState = createSlice({
  name: "clientState",
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.likedItems.includes(id)) {
        state.likedItems = state.likedItems.filter((item) => item !== id);
      } else {
        state.likedItems.push(id);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("likes", JSON.stringify(state.likedItems));
      }
    },
    toggleCart: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.cartItems.includes(id)) {
        state.cartItems = state.cartItems.filter((item) => item !== id);
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
