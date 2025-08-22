import { Container } from "../headerBoard/headerBoard";
import Style from "./Header.module.scss";
import TopBar from "./TopBar/TopBar";
import HeaderMiddle from "./HeaderMiddle/HeaderMiddle";

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
