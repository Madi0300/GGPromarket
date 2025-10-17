import Style from "./Collections.module.scss";
import { Title } from "../home";
import { useState, useEffect, useRef } from "react";
import { useGetCollectionsDataQuery } from "#/apiSlise";

type CollectionItem = {
  title: string;
  autor: string;
  imgSrc: string;
  href: string;
};

type CollectionsMap = {
  main: CollectionItem;
  second: CollectionItem;
  third: CollectionItem;
  fourth: CollectionItem;
  fifth: CollectionItem;
};

const defaultCollections: CollectionsMap = {
  main: {
    title: "Error",
    autor: "Kerama Marazzi",
    imgSrc: "/collections/main.png",
    href: "/collections/1",
  },
  second: {
    title: "Error ",
    autor: "LB-Ceramics",
    imgSrc: "/collections/second.png",
    href: "/collections/2",
  },
  third: {
    title: "Error",
    autor: "Gracia Ceramica",
    imgSrc: "/collections/third.png",
    href: "/collections/3",
  },
  fourth: {
    title: "Error",
    autor: "Alma Ceramica",
    imgSrc: "/collections/fourth.png",
    href: "/collections/4",
  },
  fifth: {
    title: "Error",
    autor: "Kerama Marazzi",
    imgSrc: "/collections/fifth.png",
    href: "/collections/5",
  },
};

export default function Collections() {
  const { data, isSuccess, isError, error } = useGetCollectionsDataQuery(null);
  const items = isSuccess ? data : defaultCollections;
  const [isVisible, setIsVisible] = useState<Boolean>(false);
  const mainRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    const elem = mainRef.current;
    if (!elem) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(elem);
        }
      },
      {
        root: null,
        rootMargin: "200px",
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
      <Title description="Коллекции плитки" />
      <div className={Style.Collections}>
        <a
          href={items.main.href}
          ref={mainRef}
          className={`${Style.Collections__main} ${Style.Collections__item}`}
        >
          {isVisible ? (
            <img
              className={Style.Collections__img}
              src={items.main.imgSrc}
              alt={items.main.title}
            />
          ) : null}
          <div className={Style.Collections__content}>
            <div className={Style.Collections__title}>{items.main.title}</div>
            <div className={Style.Collections__autor}>{items.main.autor}</div>
          </div>
        </a>
        <a
          href={items.second.href}
          className={`${Style.Collections__second} ${Style.Collections__item}`}
        >
          {isVisible ? (
            <img
              className={Style.Collections__img}
              src={items.second.imgSrc}
              alt={items.second.title}
            />
          ) : null}
          <div className={Style.Collections__content}>
            <div className={Style.Collections__title}>{items.second.title}</div>
            <div className={Style.Collections__autor}>{items.second.autor}</div>
          </div>
        </a>
        <a
          href={items.third.href}
          className={`${Style.Collections__third} ${Style.Collections__item}`}
        >
          {isVisible ? (
            <img
              className={Style.Collections__img}
              src={items.third.imgSrc}
              alt={items.third.title}
            />
          ) : null}
          <div className={Style.Collections__content}>
            <div className={Style.Collections__title}>{items.third.title}</div>
            <div className={Style.Collections__autor}>{items.third.autor}</div>
          </div>
        </a>
        <a
          href={items.fourth.href}
          className={`${Style.Collections__fourth} ${Style.Collections__item}`}
        >
          {isVisible ? (
            <img
              className={Style.Collections__img}
              src={items.fourth.imgSrc}
              alt={items.fourth.title}
            />
          ) : null}
          <div className={Style.Collections__content}>
            <div className={Style.Collections__title}>{items.fourth.title}</div>
            <div className={Style.Collections__autor}>{items.fourth.autor}</div>
          </div>
        </a>
        <a
          href={items.fifth.href}
          className={`${Style.Collections__fifth} ${Style.Collections__item}`}
        >
          {isVisible ? (
            <img
              className={Style.Collections__img}
              src={items.fifth.imgSrc}
              alt={items.fifth.title}
            />
          ) : null}
          <div className={Style.Collections__content}>
            <div className={Style.Collections__title}>{items.fifth.title}</div>
            <div className={Style.Collections__autor}>{items.fifth.autor}</div>
          </div>
        </a>
      </div>
    </>
  );
}
