import Style from "./HeaderBoard.module.scss";
import type { ReactNode } from "react";
import { useState, useRef, useEffect, forwardRef } from "react";

export function Logo() {
  return (
    <>
      <div className={Style.Logo}>
        <a href="/">
          <img className={Style.Logo_img} src="/headerBoard/logo.svg" />
        </a>
      </div>
    </>
  );
}

export function Container({ children }: { children: ReactNode }) {
  return <div className={Style.Container}>{children}</div>;
}

type Item = { name: string; href: string };

type Props = {
  toggleKey: number;
  items: Item[];
  position?: "left" | "right";
};

export const Dropdown = forwardRef<HTMLDivElement, Props>(function Dropdown(
  { toggleKey, items, position = "left" },
  forwardedRef
) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!forwardedRef) return;

    if (typeof forwardedRef === "function") {
      forwardedRef(localRef.current);
    } else {
      (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current =
        localRef.current;
    }

    return () => {
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") {
        forwardedRef(null);
      } else {
        (
          forwardedRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = null;
      }
    };
  }, [forwardedRef]);

  useEffect(() => {
    let timer: number | undefined;

    if (!isOpen && toggleKey > 0) {
      timer = window.setTimeout(() => {
        setIsOpen(true);
      }, 0);
    } else {
      if (localRef.current) {
        localRef.current.classList.remove(Style.Dropdown__list__active);
      }
      timer = window.setTimeout(() => {
        if (!localRef.current) return;
        localRef.current.classList.remove(Style.Dropdown__list__active);
        setIsOpen(false);
      }, 300);
    }

    return () => {
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [toggleKey]);

  useEffect(() => {
    if (isOpen && localRef.current) {
      localRef.current.classList.add(Style.Dropdown__list__active);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={localRef}
      className={
        Style.Dropdown__list + " " + Style["Dropdown__list__" + position]
      }
    >
      <ul className={Style.Dropdown__ul}>
        {items.map((item) => (
          <li key={item.name} className={Style.Dropdown__li}>
            <a href={item.href}>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
});

