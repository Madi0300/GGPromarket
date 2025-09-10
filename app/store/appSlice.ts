import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CatalogItem = { name: string; href: string };
export type NotificationSum = { user: number; liked: number; cart: number };
export type HeroItem = {
  title: string;
  subtitle: string;
  link: string;
  imgUrl: string;
  id: number;
};

export interface AppState {
  currentLocation: string;
  callNumber: number;
  productCatalog: CatalogItem[];
  notificationSum: NotificationSum;
  heroItems: HeroItem[];
  heroSidebarItems: { title: string; link: string; imgUrl: string }[];
}

const baseUrl = import.meta.env.BASE_URL || "/";

const initialState: AppState = {
  currentLocation: "Москва",
  callNumber: 84950183210,

  productCatalog: [
    { name: "Сантехника", href: "#" },
    { name: "Смесители", href: "#" },
    { name: "Душевые системы", href: "#" },
    { name: "Ванны и душевые кабины", href: "#" },
    { name: "Кухонные мойки", href: "#" },
    { name: "Аксессуары", href: "#" },
    { name: "Инженерная сантехника", href: "#" },
  ],

  notificationSum: {
    user: 0,
    liked: 3,
    cart: 2,
  },

  heroItems: [
    {
      title: "СМЕСИТЕЛИ\nRAIBER1",
      subtitle: "уже в наличии",
      link: "#",
      imgUrl: `${baseUrl}HeroSlider/heroSlider1.png`,
      id: 1,
    },
    {
      title: "СМЕСИТЕЛИ\nRAIBER2",
      subtitle: "уже в наличии",
      link: "#",
      imgUrl: `${baseUrl}HeroSlider/heroSlider2.png`,
      id: 2,
    },
    {
      title: "СМЕСИТЕЛИ\nRAIBER3",
      subtitle: "уже в наличии",
      link: "#",
      imgUrl: `${baseUrl}HeroSlider/heroSlider3.png`,

      id: 3,
    },
  ],
  heroSidebarItems: [
    {
      title: "УНИТАЗЫ ДО 10 000 ₽",
      link: "#",
      imgUrl: `${baseUrl}HeroSlider/sideBar1.png`,
    },
    {
      title: "ТОВАРЫ СО СКИДКОЙ",
      link: "#",
      imgUrl: `${baseUrl}HeroSlider/sideBar2.png`,
    },
  ],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentLocation(state, action: PayloadAction<string>) {
      state.currentLocation = action.payload;
    },
    setCallNumber(state, action: PayloadAction<number>) {
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
