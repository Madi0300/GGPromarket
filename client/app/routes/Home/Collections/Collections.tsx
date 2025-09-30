import Style from "./Collections.module.scss";
import { Title } from "../home";
import { useState, useEffect, useRef, useMemo } from "react";
import type { CollectionItem as CollectionEntity } from "../../../api/types";

type LayoutKeys = "main" | "second" | "third" | "fourth" | "fifth";

type CollectionsProps = {
  items?: CollectionEntity[];
};

export default function Collections({ items = [] }: CollectionsProps) {
  const [isVisible, setIsVisible] = useState<Boolean>(false);
  const mainRef = useRef<HTMLDivElement | null>(null);

  const collectionMap = useMemo(() => {
    const byId = new Map(items.map((item) => [item.id, item]));
    return {
      main: byId.get("main"),
      second: byId.get("second"),
      third: byId.get("third"),
      fourth: byId.get("fourth"),
      fifth: byId.get("fifth"),
    } as Record<LayoutKeys, CollectionEntity | undefined>;
  }, [items]);

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
        <div
          ref={mainRef}
          className={`${Style.Collections__main} ${Style.Collections__item}`}
        >
          <CollectionCard isVisible={isVisible} item={collectionMap.main} />
        </div>
        <div
          className={`${Style.Collections__second} ${Style.Collections__item}`}
        >
          <CollectionCard isVisible={isVisible} item={collectionMap.second} />
        </div>
        <div
          className={`${Style.Collections__third} ${Style.Collections__item}`}
        >
          <CollectionCard isVisible={isVisible} item={collectionMap.third} />
        </div>
        <div
          className={`${Style.Collections__fourth} ${Style.Collections__item}`}
        >
          <CollectionCard isVisible={isVisible} item={collectionMap.fourth} />
        </div>
        <div
          className={`${Style.Collections__fifth} ${Style.Collections__item}`}
        >
          <CollectionCard isVisible={isVisible} item={collectionMap.fifth} />
        </div>
      </div>
    </>
  );
}

function CollectionCard({
  item,
  isVisible,
}: {
  item?: CollectionEntity;
  isVisible: Boolean;
}) {
  if (!item) return null;

  return (
    <>
      {isVisible ? (
        <img className={Style.Collections__img} src={item.image} alt={item.title} />
      ) : null}
      <div className={Style.Collections__content}>
        <div className={Style.Collections__title}>{item.title}</div>
        <div className={Style.Collections__autor}>{item.author}</div>
      </div>
    </>
  );
}
