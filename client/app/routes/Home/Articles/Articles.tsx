import { Title } from "../home";
import Style from "./Articles.module.scss";
import { useState, useRef, useEffect } from "react";

type Article = {
  title: string;
  imgUrl: string;
  link: string;
};

const articles: Article[] = [
  {
    title: "Актуальные и необычные аксессуары для ванной комнаты",
    imgUrl: "article/img1.png",
    link: "/articles/1",
  },
  {
    title: "Какой температуры должна быть горячая вода?",
    imgUrl: "article/img1.png",
    link: "/articles/1",
  },
  {
    title: "Конденсат на бачке унитаза: причины появления и способы устранения",
    imgUrl: "article/img1.png",
    link: "/articles/1",
  },
  {
    title: "Анаэробный герметик для резьбовых соединений",
    imgUrl: "article/img1.png",
    link: "/articles/1",
  },
  {
    title: "Анаэробный герметик для резьбовых соединений",
    imgUrl: "article/img1.png",
    link: "/articles/1",
  },
  {
    title: "Анаэробный герметик для резьбовых соединений",
    imgUrl: "article/img1.png",
    link: "/articles/1",
  },
  {
    title: "Анаэробный герметик для резьбовых соединений",
    imgUrl: "article/img1.png",
    link: "/articles/1",
  },
  {
    title: "Анаэробный герметик для резьбовых соединений",
    imgUrl: "article/img1.png",
    link: "/articles/1",
  },
];

export default function Articles() {
  const scrollEl = useRef<HTMLDivElement | null>(null);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollEl.current;
    if (!el) return;

    const card = el.querySelector(
      `.${Style.ArticleCard}`
    ) as HTMLElement | null;
    const gap = 20;
    const defaultCardWidth = 370;
    const cardWidth = card ? card.offsetWidth : defaultCardWidth;

    el.scrollBy({
      left: direction === "right" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <>
      <Title description="Статьи" />
      <div className={Style.Articles}>
        <div ref={scrollEl} className={Style.Articles__slider}>
          {articles.map((item) => {
            return (
              <ArticleCard key={item.title} item={item} scrollEl={scrollEl} />
            );
          })}
        </div>
        <div className={Style.Articles__buttons}>
          <button
            type="button"
            onClick={() => scrollBy("left")}
            className={Style.Articles__buttonLeft}
          >
            <img
              className={Style.Articles__buttonImg}
              src="/Goods/arrow.svg"
              alt="arrow"
            />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("right")}
            className={Style.Articles__buttonRight}
          >
            <img
              className={Style.Articles__buttonImg}
              src="/Goods/arrow.svg"
              alt="arrow"
            />
          </button>
        </div>
      </div>
    </>
  );
}

function ArticleCard({
  item,
  scrollEl,
}: {
  item: Article;
  scrollEl: React.RefObject<HTMLDivElement | null>;
}) {
  const intersectingElem = useRef<HTMLAnchorElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isDefaultImg, setIsDefaultImg] = useState(false);
  const defaultImg = "/Articles/defaultImg.png";

  useEffect(() => {
    if (isIntersecting) return;
    if (!intersectingElem.current) return;
    const elem = intersectingElem.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(elem);
        }
      },
      {
        root: scrollEl.current,
        rootMargin: "300px",
        threshold: 0.1,
      }
    );

    observer.observe(elem);
  });

  return (
    <>
      <a ref={intersectingElem} href={item.link} className={Style.ArticleCard}>
        {isIntersecting ? (
          <img
            className={Style.ArticleCard__img}
            src={!isDefaultImg ? item.imgUrl : defaultImg}
            alt={item.title}
            onError={() => {
              if (isDefaultImg) return;
              console.log("ddd");
              setIsDefaultImg(true);
            }}
          />
        ) : null}
        <h4 className={Style.ArticleCard__title}>{item.title}</h4>
      </a>
    </>
  );
}
