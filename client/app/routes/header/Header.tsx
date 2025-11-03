import { Container } from "../headerBoard/ui";
import Style from "./Header.module.scss";
import TopBar from "./TopBar/TopBar";
import HeaderMiddle from "./HeaderMiddle/HeaderMiddle";

export const headerData = {
  currentLocation: "Москва",
  callNumber: 81231231223,
  productCatalog: [
    { name: "Сантехника", href: "/santehnika" },
    { name: "Смесители", href: "/smesiteli" },
    { name: "Душевые системы", href: "/dusevie-sistemy" },
    { name: "Ванны и душевые кабины", href: "/vanny-i-dusevie-kabiny" },
    { name: "Кухонные мойки", href: "/kuhovie-myki" },
    { name: "Аксессуары", href: "/aksesuary" },
    { name: "Инженерная сантехника", href: "/ingeniernaya-santehnika" },
  ],
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
