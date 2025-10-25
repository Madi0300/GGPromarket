import { Title } from "../home";
import Style from "./Articles.module.scss";
import { useState, useRef, useEffect } from "react";
import { useGetArticlesDataQuery } from "#/apiSlise";

type Article = {
  title: string;
  imgUrl: string;
  link: string;
  id: number;
};

export default function Articles() {
  const { data, isSuccess, isError, error, isLoading } =
    useGetArticlesDataQuery(null);
  const dataItems = isSuccess ? data : null;
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
      {isSuccess ? (
        <div className={Style.Articles}>
          <div ref={scrollEl} className={Style.Articles__slider}>
            {dataItems.map((item: Article) => {
              return (
                <ArticleCard key={item.id} item={item} scrollEl={scrollEl} />
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
                src={`${import.meta.env.BASE_URL}Goods/arrow.svg`}
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
                src={`${import.meta.env.BASE_URL}Goods/arrow.svg`}
                alt="arrow"
              />
            </button>
          </div>
        </div>
      ) : null}
      {isLoading ? (
        <div className={Style.Articles__loading}>Загрузка...</div>
      ) : null}
      {isError ? (
        <div className={Style.Articles__error}>
          Ошибка загрузки статей:{" "}
          {error && "status" in error ? error.status : error.message}
        </div>
      ) : null}
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
  const defaultImg = `${import.meta.env.BASE_URL}Articles/defaultImg.png`;

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
