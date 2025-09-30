import Style from "./Hero.module.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HeroPayload } from "../../../api/types";

type HeroProps = {
  items?: HeroPayload["slider"];
  sidebar?: HeroPayload["sidebar"];
};

export default function Hero({ items = [], sidebar = [] }: HeroProps) {
  const [currentItem, setCurrentItem] = useState(0);
  const [isSliderImgDefault, setIsSliderImgDefault] = useState(false);
  const [isSidebarFirstImgDefault, setIsSidebarFirstImgDefault] =
    useState(false);
  const [isSidebarSecondImgDefault, setIsSidebarSecondImgDefault] =
    useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const baseUrl = import.meta.env.BASE_URL || "/";
  const defaultImageUrl = `${baseUrl}HeroSlider/default.png`;

  useEffect(() => {
    if (currentItem >= items.length) {
      setCurrentItem(0);
    }
  }, [items.length, currentItem]);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const slide = items[currentItem] ?? items[0];
  const sidebarItems = useMemo(() => sidebar.slice(0, 2), [sidebar]);

  if (!slide) {
    return null;
  }

  const handleButtonClick = (direction: "left" | "right") => {
    setIsSliderImgDefault(false);
    setCurrentItem((prev) => {
      if (direction === "left") {
        return prev === 0 ? items.length - 1 : prev - 1;
      }
      return prev === items.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <div className={Style.Hero} ref={containerRef}>
      <div className={Style.Hero__slider}>
        <div className={Style.Hero__slider__imageWrapper}>
          {isVisible && (
            <img
              className={Style.Hero__slider__img}
              src={!isSliderImgDefault ? slide.image : defaultImageUrl}
              alt={slide.title}
              onError={() => {
                setIsSliderImgDefault(true);
              }}
            />
          )}
        </div>
        <div className={Style.Hero__slider__content}>
          <h2 className={Style.Hero__slider__title}>{slide.title}</h2>
          <p className={Style.Hero__slider__subtitle}>{slide.subtitle}</p>
          <a href={slide.cta.href} className={Style.Hero__slider__button}>
            {slide.cta.label}
          </a>
        </div>
        <div className={Style.Hero__slider__nav}>
          <button
            onClick={() => handleButtonClick("left")}
            className={Style.Hero__slider__navButtonLeft}
            aria-label="Previous"
          >
            <img src="/HeroSlider/arrowLeft.svg" alt="" />
          </button>
          <button
            onClick={() => handleButtonClick("right")}
            className={Style.Hero__slider__navButtonRight}
            aria-label="Next"
          >
            <img src="/HeroSlider/arrowRight.svg" alt="" />
          </button>
        </div>
      </div>
      <div className={Style.Hero__sidebar}>
        {sidebarItems.map((item, index) => {
          const isFirst = index === 0;
          const isDefault = isFirst
            ? isSidebarFirstImgDefault
            : isSidebarSecondImgDefault;
          const setDefault = isFirst
            ? setIsSidebarFirstImgDefault
            : setIsSidebarSecondImgDefault;

          return (
            <div key={item.id} className={Style.Hero__sidebar__item}>
              <div className={Style.Hero__sidebar__imageWrapper}>
                {isVisible ? (
                  <img
                    className={Style.Hero__sidebar__img}
                    src={!isDefault ? item.image : defaultImageUrl}
                    onError={() => {
                      setDefault(true);
                    }}
                    alt={item.title}
                  />
                ) : null}
              </div>
              <div className={Style.Hero__sidebar__content}>
                <h3 className={Style.Hero__sidebar__title}>{item.title}</h3>
                <a className={Style.Hero__sidebar__button} href={item.href}>
                  Подробнее
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
