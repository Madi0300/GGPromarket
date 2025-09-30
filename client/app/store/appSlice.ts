import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CatalogItem = { name: string; href: string };
export type NotificationSum = { user: number; favourites: number; cart: number };
export type HeroItem = {
  title: string;
  subtitle: string;
  link: string;
  imgUrl: string;
  id: number;
};

export interface AppState {
  currentLocation: string;
  callNumber: string;
  productCatalog: CatalogItem[];
  notificationSum: NotificationSum;
  heroItems: HeroItem[];
  heroSidebarItems: { title: string; link: string; imgUrl: string }[];
}

const initialState: AppState = {
  currentLocation: "",
  callNumber: "",
  productCatalog: [],
  notificationSum: {
    user: 0,
    favourites: 0,
    cart: 0,
  },
  heroItems: [],
  heroSidebarItems: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentLocation(state, action: PayloadAction<string>) {
      state.currentLocation = action.payload;
    },
    setCallNumber(state, action: PayloadAction<string>) {
      state.callNumber = action.payload;
    },
    setProductCatalog(state, action: PayloadAction<CatalogItem[]>) {
      state.productCatalog = action.payload;
    },
    setNotificationSum(state, action: PayloadAction<NotificationSum>) {
      state.notificationSum = action.payload;
    },
    setHeroItems(state, action: PayloadAction<HeroItem[]>) {
      state.heroItems = action.payload;
    },
    setHeroSidebarItems(
      state,
      action: PayloadAction<{ title: string; link: string; imgUrl: string }[]>
    ) {
      state.heroSidebarItems = action.payload;
    },
  },
});

export const {
  setCurrentLocation,
  setCallNumber,
  setProductCatalog,
  setNotificationSum,
  setHeroItems,
  setHeroSidebarItems,
} = appSlice.actions;

export default appSlice.reducer;
