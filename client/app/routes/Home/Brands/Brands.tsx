import { Title } from "../home";
import Style from "./Brands.module.scss";
import { useEffect, useRef, useState } from "react";
import { useGetBrandsDataQuery } from "#/apiSlise";

type Brand = {
  name: string;
  imgUrl: string;
  link: string;
};

export default function Brands() {
  const { data, isSuccess, isError, error, isLoading } =
    useGetBrandsDataQuery(null);
  const items = isSuccess ? data : null;
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
        {isSuccess ? (
          <>
            <div ref={scrollEl} className={Style.Brands}>
              {items.map((item: Brand) => {
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
                  src={`${import.meta.env.BASE_URL}Goods/arrow.svg`}
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
                  src={`${import.meta.env.BASE_URL}Goods/arrow.svg`}
                  alt="arrow"
                />
              </button>
            </div>
          </>
        ) : null}
        {isLoading ? <div>Загрузка...</div> : null}
        {isError ? (
          <div className={Style.Brands__error}>
            Ошибка загрузки: {JSON.stringify(error)}
          </div>
        ) : null}
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
  const defaultImg = `${import.meta.env.BASE_URL}Brands/defaultImg.png`;
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
