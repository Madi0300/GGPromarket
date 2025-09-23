import { Title } from "../home";
import Style from "./Brands.module.scss";
import { useEffect, useRef, useState } from "react";

type Brand = {
  name: string;
  imgUrl: string;
  link: string;
};

export const brandsList: Brand[] = [
  {
    name: "Hansgrohe",
    imgUrl: "/assets/brands/hansgrohe.svg",
    link: "/brands/hansgrohe",
  },
  { name: "GROHE", imgUrl: "/assets/brands/grohe.svg", link: "/brands/grohe" },
  {
    name: "STWORKI",
    imgUrl: "/assets/brands/stworki.svg",
    link: "/brands/stworki",
  },
  { name: "AM.PM", imgUrl: "/assets/brands/am-pm.svg", link: "/brands/am-pm" },
  {
    name: "Jacob Delafon",
    imgUrl: "/assets/brands/jacob-delafon.svg",
    link: "/brands/jacob-delafon",
  },
  {
    name: "Cersanit",
    imgUrl: "/assets/brands/cersanit.svg",
    link: "/brands/cersanit",
  },

  {
    name: "GEBERIT",
    imgUrl: "/assets/brands/geberit.svg",
    link: "/brands/geberit",
  },
  { name: "Roca", imgUrl: "/assets/brands/roca.svg", link: "/brands/roca" },
  { name: "VitrA", imgUrl: "/assets/brands/vitra.svg", link: "/brands/vitra" },
  {
    name: "Villeroy & Boch",
    imgUrl: "/assets/brands/villeroy-boch.svg",
    link: "/brands/villeroy-boch",
  },
  {
    name: "Ideal Standard",
    imgUrl: "/assets/brands/ideal-standard.svg",
    link: "/brands/ideal-standard",
  },
  {
    name: "Aquanika",
    imgUrl: "/assets/brands/aquanika.svg",
    link: "/brands/aquanika",
  },

  {
    name: "Benetto",
    imgUrl: "/assets/brands/benetto.svg",
    link: "/brands/benetto",
  },
  {
    name: "Colombo",
    imgUrl: "/assets/brands/colombo.svg",
    link: "/brands/colombo",
  },
  { name: "Dyson", imgUrl: "/assets/brands/dyson.svg", link: "/brands/dyson" },
  {
    name: "Gorenje",
    imgUrl: "/assets/brands/gorenje.svg",
    link: "/brands/gorenje",
  },
  { name: "JADO", imgUrl: "/assets/brands/jado.svg", link: "/brands/jado" },
  { name: "LVI", imgUrl: "/assets/brands/lvi.svg", link: "/brands/lvi" },
];

export default function Brands({ items = brandsList }: { items: Brand[] }) {
  const scrollEl = useRef<HTMLDivElement | null>(null);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollEl.current;
    if (!el) return;

    const brandCard = el.querySelector(
      `.${Style.BrandsCard}`
    ) as HTMLElement | null;
    const gap = 20;
    const defaultCardWidth = 240;
    const cardWidth = brandCard ? brandCard.offsetWidth : defaultCardWidth;

    el.scrollBy({
      left: direction === "right" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <>
      <Title description="Популярные бренды"></Title>
      <div className={Style.BrandsSlider}>
        <div ref={scrollEl} className={Style.Brands}>
          {items.map((item) => {
            return (
              <BrandsCard key={item.name} item={item} scrollEl={scrollEl} />
            );
          })}
        </div>
        <div className={Style.BrandsSlider__buttons}>
          <button
            type="button"
            onClick={() => scrollBy("left")}
            className={Style.BrandsSlider__buttonLeft}
          >
            <img
              className={Style.BrandsSlider__buttonImg}
              src="/Goods/arrow.svg"
              alt="arrow"
            />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("right")}
            className={Style.BrandsSlider__buttonRight}
          >
            <img
              className={Style.BrandsSlider__buttonImg}
              src="/Goods/arrow.svg"
              alt="arrow"
            />
          </button>
        </div>
      </div>
    </>
  );
}

function BrandsCard({
  item,
  scrollEl,
}: {
  item: Brand;
  scrollEl: React.RefObject<HTMLDivElement | null>;
}) {
  const [isDefaultImg, setIsDefaultImg] = useState(false);
  const defaultImg = "/Brands/defaultImg.svg";
  const [isVisible, setIsVisible] = useState(false);
  const intersectingElem = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!intersectingElem.current) return;
    if (isVisible) return;

    const elem = intersectingElem.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(elem);
        }
      },
      {
        root: scrollEl.current,
        rootMargin: "250px",
        threshold: 0.1,
      }
    );
    observer.observe(elem);

    return () => {
      observer.disconnect();
    };
  });

  return (
    <>
      <a
        ref={intersectingElem}
        href={item.link}
        key={item.name}
        className={Style.BrandsCard}
      >
        {isVisible ? (
          <img
            className={Style.BrandsCard__img}
            src={!isDefaultImg ? item.imgUrl : defaultImg}
            alt={item.name}
            onError={() => {
              if (isDefaultImg) return;
              setIsDefaultImg(true);
            }}
          />
        ) : null}
      </a>
    </>
  );
}
