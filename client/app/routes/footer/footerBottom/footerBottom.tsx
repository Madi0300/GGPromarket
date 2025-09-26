import Style from "./footerBottom.module.scss";
import { Container } from "../../headerBoard/ui";

export default function FooterBottom() {
  return (
    <>
      <Container>
        <div className={Style.FooterBottom}>
          <p>
            Данный сайт является учебным пет-проектом и создан исключительно в
            демонстрационных целях. Он не предназначен для ведения реальной
            коммерческой деятельности, продажи товаров или оказания услуг. Вся
            информация, представленная на сайте, включая цены, описания товаров
            и услуги, носит исключительно иллюстративный характер и не должна
            восприниматься как предложение или призыв к покупке.
          </p>
          <br />
          <p>
            Сайт использует технологию cookie. Используя сайт, Вы соглашаетесь с
            <a href="#" className={Style.FooterBottom__inlineLink}>
              правилами использования cookie
            </a>{" "}
            , а также даете{" "}
            <a href="#" className={Style.FooterBottom__inlineLink}>
              согласие на обработку персональных данных
            </a>
            .
          </p>
        </div>
      </Container>
    </>
  );
}

function HelloWorld() {
  return <>Hello m</>;
}
