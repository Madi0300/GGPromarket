import { Container } from "../headerBoard/ui";
import Style from "./Header.module.scss";
import TopBar from "./TopBar/TopBar";
import HeaderMiddle from "./HeaderMiddle/HeaderMiddle";
import {
  catalogCategories,
  getCatalogCategoryLink,
} from "@/Catalog/catalogCategories";

export const headerData = {
  currentLocation: "Москва",
  callNumber: 81231231223,
  productCatalog: catalogCategories.map((item) => ({
    name: item.label,
    href: getCatalogCategoryLink(item.key),
  })),
};

export default function Header() {
  return (
    <>
      <header className={Style.header}>
        <div className={Style.header__wrapper}>
          <Container>
            <TopBar />
            <HeaderMiddle />
          </Container>
        </div>
      </header>
    </>
  );
}
