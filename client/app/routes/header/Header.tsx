import { useRouteLoaderData } from "react-router";
import { Container } from "../headerBoard/ui";
import Style from "./Header.module.scss";
import TopBar from "./TopBar/TopBar";
import HeaderMiddle from "./HeaderMiddle/HeaderMiddle";
import type { LayoutPayload } from "../../api/types";

export default function Header() {
  const layoutData = useRouteLoaderData<LayoutPayload | undefined>("root-layout");
  const config = layoutData?.config;

  return (
    <>
      <header className={Style.header}>
        <div className={Style.header__wrapper}>
          <Container>
            <TopBar
              city={config?.branding.defaultCity}
              supportPhone={config?.contacts.supportPhone}
              rawPhone={config?.contacts.rawPhone}
              navigation={config?.navigation}
            />
            <HeaderMiddle
              catalog={config?.catalogShortcuts}
              counters={config?.counters}
            />
          </Container>
        </div>
      </header>
    </>
  );
}
