import { Title } from "../home";
import Style from "./Articles.module.scss";
import { useState, useRef, useEffect, type RefObject } from "react";
import type { Article as ArticleEntity } from "../../../api/types";

type ArticlesProps = {
  items?: ArticleEntity[];
};

export default function Articles({ items = [] }: ArticlesProps) {
  const scrollEl = useRef<HTMLDivElement | null>(null);

  if (items.length === 0) {
    return null;
  }

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
          {items.map((item) => {
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

type ArticleCardProps = {
  item: ArticleEntity;
  scrollEl: RefObject<HTMLDivElement | null>;
};

function ArticleCard({ item, scrollEl }: ArticleCardProps) {
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

  const imageSrc = item.image && !isDefaultImg ? item.image : defaultImg;

  return (
    <a ref={intersectingElem} href={item.href} className={Style.ArticleCard}>
      {isIntersecting ? (
        <img
          className={Style.ArticleCard__img}
          src={imageSrc}
          alt={item.title}
          onError={() => {
            if (isDefaultImg) return;
            setIsDefaultImg(true);
          }}
        />
      ) : null}
      <h4 className={Style.ArticleCard__title}>{item.title}</h4>
    </a>
  );
}
