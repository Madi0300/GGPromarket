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
  return (
    <>
      <Title description="Статьи" />
      <div className={Style.Articles}>
        <div className={Style.Articles__slider}>
          {articles.map((item) => {
            return <ArticleCard item={item} />;
          })}
        </div>
      </div>
    </>
  );
}

function ArticleCard({ item }: { item: Article }) {
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
        root: null,
        rootMargin: "100px",
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
