import { Outlet } from "react-router";
import Header from "../header/Header";
import Footer from "../footer/Footer";
export default function HeaderBoard() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
