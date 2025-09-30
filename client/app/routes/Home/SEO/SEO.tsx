import Style from "./SEO.module.scss";
import type { SeoBlock } from "../../../api/types";

type SEOProps = {
  block?: SeoBlock;
};

export default function SEO({ block }: SEOProps) {
  if (!block) return null;

  return (
    <div className={Style.SEO}>
      <div className={Style.SEO__imgWrapper}>
        {block.image ? (
          <img className={Style.SEO__img} src={block.image} alt={block.title} />
        ) : null}
      </div>
      <div className={Style.SEO__content}>
        <h2 className={Style.SEO__title}>{block.title}</h2>
        <div className={Style.SEO__textWrapper}>
          {block.content.map((paragraph, index) => (
            <p key={index} className={Style.SEO__text}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
