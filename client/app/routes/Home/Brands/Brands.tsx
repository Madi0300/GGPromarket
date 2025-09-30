import { Title } from "../home";
import Style from "./Brands.module.scss";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { Brand } from "../../../api/types";

type BrandsProps = {
  items?: Brand[];
};

export default function Brands({ items = [] }: BrandsProps) {
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

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <Title description="Популярные бренды"></Title>
      <div className={Style.BrandsSlider}>
        <div ref={scrollEl} className={Style.Brands}>
          {items.map((item) => {
            return (
              <BrandsCard key={item.id} item={item} scrollEl={scrollEl} />
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

type BrandCardProps = {
  item: Brand;
  scrollEl: RefObject<HTMLDivElement | null>;
};

function BrandsCard({ item, scrollEl }: BrandCardProps) {
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

  const href = item.website || `/brands/${item.slug}`;

  return (
    <a ref={intersectingElem} href={href} className={Style.BrandsCard}>
      {isVisible ? (
        <img
          className={Style.BrandsCard__img}
          src={!isDefaultImg && item.logo ? item.logo : defaultImg}
          alt={item.name}
          onError={() => {
            if (isDefaultImg) return;
            setIsDefaultImg(true);
          }}
        />
      ) : null}
    </a>
  );
}
