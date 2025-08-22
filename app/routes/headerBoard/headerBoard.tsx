import type { Route } from "../+types/home";
import { Outlet } from "react-router";
import Header from "../header/Header";
import Style from "./HeaderBoard.module.scss";
import type { ReactNode } from "react";

export default function headerBoard() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export function Logo({ width, height }: { width: number; height: number }) {
  return (
    <>
      <div className={Style.Logo}>
        <img
          style={{ width: width, height: height }}
          className={Style.Logo_img}
          src="/headerBoard/logo.svg"
        ></img>
      </div>
    </>
  );
}

export function Container({ children }: { children: ReactNode }) {
  return <div className={Style.Container}>{children}</div>;
}
