import type { Route } from "./+types/home";
import { Container } from "../headerBoard/ui";
import Style from "./home.module.scss";
import { Outlet, useParams } from "react-router";
import { useEffect, lazy, Suspense } from "react";

import Hero from "./Hero/Hero";
const Icons = lazy(() => import("./Icons/Icons"));
const Collections = lazy(() => import("./Collections/Collections"));
const Goods = lazy(() => import("./Goods/Goods"));
const Brands = lazy(() => import("./Brands/Brands"));
const Articles = lazy(() => import("./Articles/Articles"));
const SEO = lazy(() => import("./SEO/SEO"));

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
        <Suspense fallback={<div>Загрузка...</div>}>
          <Hero />
          <Icons />
          <Collections />
          <Goods />
          <Brands />
          <Articles />
          <SEO />
        </Suspense>
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
