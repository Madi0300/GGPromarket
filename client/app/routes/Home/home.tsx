import type { Route } from "./+types/home";
import Hero from "./Hero/Hero";
import Icons from "./Icons/Icons";
import Collections from "./Collections/Collections";
import { Container } from "../headerBoard/ui";
import Goods from "./Goods/Goods";
import Style from "./home.module.scss";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <Container>
        <Hero />
        <Icons />
        <Collections />
        <Goods />
      </Container>
    </>
  );
}

export function Title({ description }: { description: string }) {
  return <div className={Style.Title}>{description}</div>;
}
