export const appConfig = {
  id: "default",
  locale: "ru-RU",
  branding: {
    companyName: "GG Promarket",
    defaultCity: "Москва",
  },
  contacts: {
    supportPhone: "+7 (495) 018-32-10",
    rawPhone: "+74950183210",
    supportEmail: "zakaz@ggpromarket.ru",
  },
  counters: {
    user: 0,
    favourites: 3,
    cart: 2,
  },
  navigation: [
    { id: "catalog", label: "Каталог", href: "/catalog" },
    { id: "delivery", label: "Доставка", href: "/delivery" },
    { id: "discounts", label: "Скидки", href: "/discounts" },
    { id: "brands", label: "Бренды", href: "/brands" },
    { id: "contacts", label: "Контакты", href: "/contacts" },
  ],
  catalogShortcuts: [
    { id: "plumbing", label: "Сантехника", href: "/catalog/plumbing" },
    { id: "mixers", label: "Смесители", href: "/catalog/mixers" },
    { id: "shower-systems", label: "Душевые системы", href: "/catalog/shower-systems" },
    { id: "bath-cabin", label: "Ванны и душевые кабины", href: "/catalog/bath" },
    { id: "kitchen-sinks", label: "Кухонные мойки", href: "/catalog/kitchen-sinks" },
    { id: "accessories", label: "Аксессуары", href: "/catalog/accessories" },
    {
      id: "engineering-plumbing",
      label: "Инженерная сантехника",
      href: "/catalog/engineering-plumbing",
    },
  ],
};
