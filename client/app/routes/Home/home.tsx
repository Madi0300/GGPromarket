import type { Route } from "./+types/home";
import { useLoaderData, type ClientLoaderFunctionArgs } from "react-router";
import Hero from "./Hero/Hero";
import Icons from "./Icons/Icons";
import Collections from "./Collections/Collections";
import { Container } from "../headerBoard/ui";
import Goods from "./Goods/Goods";
import Brands from "./Brands/Brands";
import Style from "./home.module.scss";
import Articles from "./Articles/Articles";
import SEO from "./SEO/SEO";
import type { HomePayload } from "../../api/types";
import { fetchFromApi } from "../../utils/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GG Promarket — магазин сантехники" },
    {
      name: "description",
      content:
        "GG Promarket — витрина сантехнического оборудования, плитки и бытовой техники.",
    },
  ];
}

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  return fetchFromApi<HomePayload>(request, "/api/home");
}

export default function Home() {
  const data = useLoaderData<typeof clientLoader>();
  const hero = data?.hero;
  const icons = data?.icons ?? [];
  const collections = data?.collections ?? [];
  const products = data?.products;
  const brands = data?.brands ?? [];
  const articles = data?.articles ?? [];
  const seo = data?.seo;

  return (
    <>
      <Container>
        <Hero items={hero?.slider} sidebar={hero?.sidebar} />
        <Icons content={icons} />
        <Collections items={collections} />
        <Goods
          items={products?.items}
          categories={products?.categories}
          highlights={products?.highlights}
        />
        <Brands items={brands} />
        <Articles items={articles} />
        <SEO block={seo} />
      </Container>
    </>
  );
}

export function Title({ description }: { description: string }) {
  return <div className={Style.Title}>{description}</div>;
}
