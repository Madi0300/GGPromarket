import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likeTouched: 0,
  likesButtonTouched: false,
  cartButtonTouched: false,
};

const clientState = createSlice({
  name: "clientState",
  initialState,
  reducers: {
    increment: (state) => {
      state.likeTouched += 1;
      console.log(state.likeTouched);
    },
    toogleLikesButton: (state) => {
      state.likesButtonTouched = !state.likesButtonTouched;
    },
    toogleCartButton: (state) => {
      state.cartButtonTouched = !state.cartButtonTouched;
    },
  },
});

export const { increment, toogleLikesButton, toogleCartButton } =
  clientState.actions;
export default clientState.reducer;
