import { Outlet } from "react-router";
import { lazy } from "react";
import Header from "../header/Header";
const Footer = lazy(() => import("../footer/Footer"));
export default function HeaderBoard() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
