import Style from "./SEO.module.scss";

export default function SEO() {
  return (
    <>
      <div className={Style.SEO}>
        <div className={Style.SEO__imgWrapper}>
          <img className={Style.SEO__img} src="/SEO/SEO.png" alt="SEO" />
        </div>
        <div className={Style.SEO__content}>
          <h2 className={Style.SEO__title}>Блок SEO-текста про магазин</h2>
          <div className={Style.SEO__textWrapper}>
            <p className={Style.SEO__text}>
              GG Promarket — крупный ритейлер сантехнического оборудования,
              плитки и аксессуаров. Мы нацелены на то, чтобы сделать процесс
              выбора и покупки сантехники максимально простым и интуитивно
              понятным. При создании и обновлении сайта santehnika-online.ru мы
              продумали логичную структуру каталога, организовали систему
              поиска, снабдили карточки товаров подробными описаниями и
              характеристиками. Выбирать оборудование в нашем магазине легко
              даже тем, кто впервые имеет дело с сантехникой. А уточнить детали
              и получить информацию о совместимости товаров круглосуточно
              помогут опытные консультанты нашего контакт-центра. С нами вы
              полюбите выбирать!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
