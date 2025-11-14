export const catalogCategories = [
  { key: "Sinks", label: "Раковины" },
  { key: "Baths", label: "Ванны" },
  { key: "Toilets", label: "Унитазы" },
  { key: "Shower systems", label: "Душевые системы" },
  { key: "Faucets", label: "Смесители" },
  { key: "Mirrors", label: "Зеркала" },
  { key: "Shower cabins", label: "Душевые кабины" },
  { key: "Washing machines", label: "Стиральные машины" },
  { key: "Towel dryers", label: "Полотенцесушители" },
  { key: "Bidets", label: "Биде" },
  { key: "Heaters", label: "Обогреватели" },
  { key: "Dishwashers", label: "Посудомоечные машины" },
];

export const catalogCategoryLabels = catalogCategories.reduce<Record<string, string>>(
  (acc, item) => {
    acc[item.key] = item.label;
    return acc;
  },
  {}
);

export const getCatalogCategoryLink = (key: string) => {
  const params = new URLSearchParams({
    page: "1",
    categories: key,
  });
  return `/catalog?${params.toString()}`;
};
