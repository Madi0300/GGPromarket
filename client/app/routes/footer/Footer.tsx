import Style from "./Footer.module.scss";
import FooterMain from "./footerMain/footerMain";
import FooterBottom from "./footerBottom/footerBottom";

export default function Footer() {
  return (
    <>
      <div className={Style.Footer}>
        <FooterMain />
        <FooterBottom />
      </div>
    </>
  );
}
