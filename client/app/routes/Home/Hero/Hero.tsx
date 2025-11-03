import Style from "./Hero.module.scss";
import { useEffect, useRef, useState } from "react";

const hero = {
  heroItems: [
    {
      title: "СМЕСТИТЕЛИ\nGEMGREEN",
      subtitle: "уже в наличии",
      link: "#",
      imgUrl: "/Hero/slider/1/image.webp",
      id: 1,
    },
    {
      title: "ТУАЛЕТЫ\nGEMGREEN",
      subtitle: "уже в наличии",
      link: "#",
      imgUrl: "/Hero/slider/2/image.webp",
      id: 2,
    },
    {
      title: "РАКОВИНЫ\nGEMGREEN",
      subtitle: "уже в наличии",
      link: "#",
      imgUrl: "/Hero/slider/3/image.webp",
      id: 3,
    },
  ],
  heroSidebarItems: [
    {
      title: "УНИТАЗЫ ДО 10 000 ₽",
      link: "#",
      imgUrl: "/Hero/sidebar/1.webp",
    },
    {
      title: "ТОВАРЫ СО СКИДКОЙ",
      link: "#",
      imgUrl: "/Hero/sidebar/2.webp",
    },
  ],
};

export default function Hero() {
  const sliderItems = hero.heroItems;
  const sideBarItems = hero.heroSidebarItems;
  const [currentItem, setCurrentItem] = useState(0);
  const baseUrl = import.meta.env.BASE_URL || "/";

  const containerRef = useRef<HTMLDivElement | null>(null);

  function handleButtonClick(direction: "left" | "right") {
    setCurrentItem((prev) => {
      if (direction === "left") {
        return prev === 0 ? sliderItems.length - 1 : prev - 1;
      } else {
        return prev === sliderItems.length - 1 ? 0 : prev + 1;
      }
    });
  }

  return (
    <div className={Style.Hero} ref={containerRef}>
      <>
        <div className={Style.Hero__slider}>
          <div className={Style.Hero__slider__imageWrapper}>
            <img
              fetchPriority="high"
              loading="eager"
              key={currentItem}
              className={Style.Hero__slider__img}
              src={sliderItems[currentItem].imgUrl}
              alt={sliderItems[currentItem].title}
            />
          </div>
          <div className={Style.Hero__slider__content}>
            <h2 className={Style.Hero__slider__title}>
              {sliderItems[currentItem].title}
            </h2>
            <p className={Style.Hero__slider__subtitle}>
              {sliderItems[currentItem].subtitle}
            </p>
            <a
              href={sliderItems[currentItem].link}
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
              <img
                src={`${import.meta.env.BASE_URL}HeroSlider/arrowLeft.svg`}
                alt=""
              />
            </button>
            <button
              onClick={() => handleButtonClick("right")}
              className={Style.Hero__slider__navButtonRight}
              aria-label="Previous"
            >
              <img
                src={`${import.meta.env.BASE_URL}HeroSlider/arrowRight.svg`}
                alt=""
              />
            </button>
          </div>
        </div>

        <div className={Style.Hero__sidebar}>
          {sideBarItems && sideBarItems.length > 0 && (
            <div className={Style.Hero__sidebar__item}>
              <div className={Style.Hero__sidebar__imageWrapper}>
                <img
                  className={Style.Hero__sidebar__img}
                  src={sideBarItems[0].imgUrl}
                  alt="#"
                />
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
                <img
                  className={Style.Hero__sidebar__img}
                  src={sideBarItems[1].imgUrl}
                  alt="#"
                />
                )
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
      </>
    </div>
  );
}
