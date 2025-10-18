import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likeTouched: 0,
  likesButtonTouched: false,
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
  },
});

export const { increment, toogleLikesButton } = clientState.actions;
export default clientState.reducer;
