import { describe, it, expect } from 'vitest';
import appReducer, {
  setCurrentLocation,
  setCallNumber,
  setProductCatalog,
  setNotificationSum,
  setHeroItems,
  setHeroSidebarItems,
  type AppState,
  type CatalogItem,
  type NotificationSum,
  type HeroItem,
} from './appSlice';

const initialState: AppState = {
  currentLocation: 'Москва',
  callNumber: 84950183210,
  productCatalog: [],
  notificationSum: { user: 0, liked: 0, cart: 0 },
  heroItems: [],
  heroSidebarItems: [],
};

describe('app slice', () => {
  it('should handle setCurrentLocation', () => {
    const newLocation = 'Санкт-Петербург';
    const action = setCurrentLocation(newLocation);
    const newState = appReducer(initialState, action);
    expect(newState.currentLocation).toEqual(newLocation);
  });

  it('should handle setCallNumber', () => {
    const newCallNumber = 1234567890;
    const action = setCallNumber(newCallNumber);
    const newState = appReducer(initialState, action);
    expect(newState.callNumber).toEqual(newCallNumber);
  });

  it('should handle setProductCatalog', () => {
    const newCatalog: CatalogItem[] = [{ name: 'Test', href: '/test' }];
    const action = setProductCatalog(newCatalog);
    const newState = appReducer(initialState, action);
    expect(newState.productCatalog).toEqual(newCatalog);
  });

  it('should handle setNotificationSum', () => {
    const newNotificationSum: NotificationSum = { user: 1, liked: 1, cart: 1 };
    const action = setNotificationSum(newNotificationSum);
    const newState = appReducer(initialState, action);
    expect(newState.notificationSum).toEqual(newNotificationSum);
  });

  it('should handle setHeroItems', () => {
    const newHeroItems: HeroItem[] = [
      { id: 1, title: 'Test', subtitle: 'Test', link: '/test', imgUrl: '/test.jpg' },
    ];
    const action = setHeroItems(newHeroItems);
    const newState = appReducer(initialState, action);
    expect(newState.heroItems).toEqual(newHeroItems);
  });

  it('should handle setHeroSidebarItems', () => {
    const newHeroSidebarItems = [
      { title: 'Test', link: '/test', imgUrl: '/test.jpg' },
    ];
    const action = setHeroSidebarItems(newHeroSidebarItems);
    const newState = appReducer(initialState, action);
    expect(newState.heroSidebarItems).toEqual(newHeroSidebarItems);
  });
});
