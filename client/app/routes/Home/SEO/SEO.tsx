import Style from "./SEO.module.scss";
import { useGetSEODataQuery } from "#/apiSlise";

export default function SEO() {
  const { data, isSuccess } = useGetSEODataQuery(null);
  const seoImg = isSuccess ? data.imgUrl : "/SEO/SEO.png";
  const seoText = isSuccess ? data.text : "";
  const seoTitle = isSuccess ? data.title : "";

  return (
    <>
      <div className={Style.SEO}>
        <div className={Style.SEO__imgWrapper}>
          <img className={Style.SEO__img} src={seoImg} alt="SEO" />
        </div>
        <div className={Style.SEO__content}>
          <h2 className={Style.SEO__title}>{seoTitle}</h2>
          <div className={Style.SEO__textWrapper}>
            <p className={Style.SEO__text}>{seoText}</p>
          </div>
        </div>
      </div>
    </>
  );
}
