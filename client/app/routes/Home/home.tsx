import type { Route } from "./+types/home";
import Hero from "./Hero/Hero";
import Icons from "./Icons/Icons";
import Collections from "./Collections/Collections";
import { Container } from "../headerBoard/ui";
import Goods from "./Goods/Goods";
import Brands from "./Brands/Brands";
import Style from "./home.module.scss";
import Articles from "./Articles/Articles";
import SEO from "./SEO/SEO";
import { Outlet, useParams } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const params = useParams();
  const { productId } = params;

  useEffect(() => {
    if (typeof productId == "string") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  });
  return (
    <>
      <Container>
        <Hero />
        <Icons />
        <Collections />
        <Goods />
        <Brands />
        <Articles />
        <SEO />
        <Outlet />
      </Container>
    </>
  );
}

export function Title({ description }: { description: string }) {
  return (
    <>
      <br />
      <div className={Style.Title}>{description}</div>
      <br />
    </>
  );
}
