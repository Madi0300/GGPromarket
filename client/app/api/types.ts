export type NavigationLink = { id: string; label: string; href: string };

export type AppConfig = {
  id: string;
  locale: string;
  branding: {
    companyName: string;
    defaultCity: string;
  };
  contacts: {
    supportPhone: string;
    rawPhone: string;
    supportEmail: string;
  };
  counters: {
    user: number;
    favourites: number;
    cart: number;
  };
  navigation: NavigationLink[];
  catalogShortcuts: NavigationLink[];
};

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  image: string;
};

export type HeroSidebarItem = {
  id: string;
  title: string;
  href: string;
  image: string;
};

export type HeroPayload = {
  slider: HeroSlide[];
  sidebar: HeroSidebarItem[];
};

export type IconItem = {
  id: string;
  icon: string;
  text: string;
};

export type CollectionItem = {
  id: string;
  title: string;
  author: string;
  image: string;
  href: string;
  order: number;
};

export type ProductCategory = {
  id: string;
  title: string;
};

export type ProductPrice = {
  current: number;
  old: number | null;
  currency: string;
};

export type ProductAvailability = {
  inStock: boolean;
  isHit: boolean;
  hasDiscount: boolean;
};

export type ProductRating = {
  score: number;
  reviewsCount: number;
};

export type ProductMedia = {
  thumbnail: string | null;
  gallery: string[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  price: ProductPrice;
  origin: string;
  availability: ProductAvailability;
  rating: ProductRating;
  media: ProductMedia;
  categories: string[];
};

export type HighlightFilters = {
  hits: string[];
  discounts: string[];
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  website: string;
  logo: string | null;
};

export type Article = {
  id: string;
  title: string;
  href: string;
  image: string | null;
  publishedAt: string;
  readingTimeMinutes: number;
};

export type SeoBlock = {
  title: string;
  image: string | null;
  content: string[];
};

export type FooterSocialLink = {
  id: string;
  label: string;
  href: string;
  icon: string;
};

export type FooterContent = {
  productLinks: NavigationLink[];
  infoLinks: NavigationLink[];
  socialMedia: FooterSocialLink[];
  schedule: string[];
  warehouseAddress: string;
  email: string;
  rating: {
    href: string;
    image: string;
    alt: string;
  };
  legal: {
    company: string;
    cookiesHref: string;
    privacyHref: string;
  };
};

export type HomePayload = {
  hero: HeroPayload;
  icons: IconItem[];
  collections: CollectionItem[];
  products: {
    items: Product[];
    categories: ProductCategory[];
    highlights: HighlightFilters;
  };
  brands: Brand[];
  articles: Article[];
  seo: SeoBlock;
};

export type LayoutPayload = {
  config: AppConfig;
  footer: FooterContent;
};
