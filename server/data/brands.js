const brands = [
  { name: "Hansgrohe", slug: "hansgrohe", website: "https://www.hansgrohe.ru" },
  { name: "GROHE", slug: "grohe", website: "https://www.grohe.ru" },
  { name: "STWORKI", slug: "stworki", website: "https://stworki.ru" },
  { name: "AM.PM", slug: "am-pm", website: "https://am.pm" },
  { name: "Jacob Delafon", slug: "jacob-delafon", website: "https://www.jacobdelafon.com" },
  { name: "Cersanit", slug: "cersanit", website: "https://www.cersanit.com" },
  { name: "GEBERIT", slug: "geberit", website: "https://www.geberit.ru" },
  { name: "Roca", slug: "roca", website: "https://www.roca.ru" },
  { name: "VitrA", slug: "vitra", website: "https://www.vitra.com.tr" },
  { name: "Villeroy & Boch", slug: "villeroy-boch", website: "https://www.villeroy-boch.eu" },
  { name: "Ideal Standard", slug: "ideal-standard", website: "https://www.idealstandard.com" },
  { name: "Aquanika", slug: "aquanika", website: "https://aquanika.ru" },
  { name: "Benetto", slug: "benetto", website: "https://benetto.ru" },
  { name: "Colombo", slug: "colombo", website: "https://colombodesign.com" },
  { name: "Dyson", slug: "dyson", website: "https://www.dyson.ru" },
  { name: "Gorenje", slug: "gorenje", website: "https://www.gorenje.com" },
  { name: "JADO", slug: "jado", website: "https://www.jado.com" },
  { name: "LVI", slug: "lvi", website: "https://www.lvi.fi" },
];

export const brandCatalog = brands.map((brand, index) => ({
  id: `brand-${index + 1}`,
  name: brand.name,
  slug: brand.slug,
  website: brand.website,
  logo: `/media/brands/${brand.slug}.svg`,
}));
