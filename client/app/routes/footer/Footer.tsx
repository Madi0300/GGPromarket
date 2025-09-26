import Style from "./footer.module.scss";
import FooterMain from "./footerMain/footerMain";

export default function Footer() {
  return (
    <>
      <div className={Style.Footer}>
        <FooterMain />
      </div>
    </>
  );
}
