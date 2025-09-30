import { useRouteLoaderData } from "react-router";
import Style from "./footer.module.scss";
import FooterMain from "./footerMain/footerMain";
import FooterBottom from "./footerBottom/footerBottom";
import type { LayoutPayload } from "../../api/types";

export default function Footer() {
  const layoutData = useRouteLoaderData<LayoutPayload | undefined>("root-layout");
  const config = layoutData?.config;
  const footer = layoutData?.footer;

  return (
    <>
      <div className={Style.Footer}>
        <FooterMain
          content={footer}
          phone={config?.contacts.supportPhone}
          rawPhone={config?.contacts.rawPhone}
        />
        <FooterBottom />
      </div>
    </>
  );
}
