import Style from "./Hero.module.scss";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useGetHeroDataQuery } from "../../../store/apiSlise";

export default function Hero() {
  const [currentItem, setCurrentItem] = useState(0);
  const baseUrl = import.meta.env.BASE_URL || "/";

  const { data, error, isLoading, isSuccess } = useGetHeroDataQuery();

  const defaultImageUrl = `${baseUrl}HeroSlider/default.png`;

  const items = isSuccess ? data.heroItems : null;
  const sideBarItems = isSuccess ? data.heroSidebarItems : null;
  const [isSliderImgDefault, setIsSliderImgDefault] = useState(false);
  const [isSidebarFirstImgDefault, setIsSidebarFirstImgDefault] =
    useState(false);

  const [isSidebarSecondImgDefault, setIsSidebarSecondImgDefault] =
    useState(false);

  const currentSliderImg = isSuccess ? items[currentItem].imgUrl : "";
  const sideBarFirstImg = isSuccess ? sideBarItems[0].imgUrl : "";
  const sideBarSecondImg = isSuccess ? sideBarItems[1].imgUrl : "";

  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  if (items && items.length === 0) return null;

  function handleButtonClick(direction: "left" | "right") {
    setCurrentItem((prev) => {
      if (direction === "left") {
        return prev === 0 ? items.length - 1 : prev - 1;
      } else {
        return prev === items.length - 1 ? 0 : prev + 1;
      }
    });
  }

  return (
    <div className={Style.Hero} ref={containerRef}>
      {isSuccess ? (
        <div className={Style.Hero__slider}>
          <div className={Style.Hero__slider__imageWrapper}>
            {isVisible && (
              <img
                className={Style.Hero__slider__img}
                src={!isSliderImgDefault ? currentSliderImg : defaultImageUrl}
                alt={items[currentItem].title}
                onError={() => {
                  setIsSliderImgDefault(true);
                }}
              />
            )}
          </div>
          <div className={Style.Hero__slider__content}>
            <h2 className={Style.Hero__slider__title}>
              {items[currentItem].title}
            </h2>
            <p className={Style.Hero__slider__subtitle}>
              {items[currentItem].subtitle}
            </p>
            <a
              href={items[currentItem].link}
              className={Style.Hero__slider__button}
            >
              Подробнее
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
              aria-label="Previous"
            >
              <img src="/HeroSlider/arrowRight.svg" alt="" />
            </button>
          </div>
        </div>
      ) : null}
      <div className={Style.Hero__sidebar}>
        {sideBarItems && sideBarItems.length > 0 && (
          <div className={Style.Hero__sidebar__item}>
            <div className={Style.Hero__sidebar__imageWrapper}>
              {isVisible ? (
                <img
                  className={Style.Hero__sidebar__img}
                  src={
                    !isSidebarFirstImgDefault
                      ? sideBarFirstImg
                      : defaultImageUrl
                  }
                  onError={() => {
                    setIsSidebarFirstImgDefault(true);
                  }}
                  alt="#"
                />
              ) : null}
            </div>
            <div className={Style.Hero__sidebar__content}>
              <h3 className={Style.Hero__sidebar__title}>
                {sideBarItems[0].title}
              </h3>
              <a
                className={Style.Hero__sidebar__button}
                href={sideBarItems[0].link}
              >
                Подробнее
              </a>
            </div>
          </div>
        )}
        {sideBarItems && sideBarItems.length > 1 && (
          <div className={Style.Hero__sidebar__item}>
            <div className={Style.Hero__sidebar__imageWrapper}>
              {isVisible ? (
                <img
                  className={Style.Hero__sidebar__img}
                  src={
                    !isSidebarSecondImgDefault
                      ? sideBarSecondImg
                      : defaultImageUrl
                  }
                  onError={() => {
                    setIsSidebarSecondImgDefault(true);
                  }}
                  alt="#"
                />
              ) : null}
            </div>
            <div className={Style.Hero__sidebar__content}>
              <h3 className={Style.Hero__sidebar__title}>
                {sideBarItems[1].title}
              </h3>
              <a
                className={Style.Hero__sidebar__button}
                href={sideBarItems[1].link}
              >
                Подробнее
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
