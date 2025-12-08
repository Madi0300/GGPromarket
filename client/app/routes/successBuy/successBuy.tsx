import Style from "./successBuy.module.scss";
import { useGetGoodListByIdsQuery } from "#/apiSlise";
import { useSearchParams } from "react-router";
import { Title } from "@/Home/home";
import { Container } from "@/headerBoard/ui";
import type { GoodsItem } from "@/types/goods";
import { useState } from "react";

export default function SuccessBuy() {
  const [searchParams] = useSearchParams();
  const idsParam = searchParams
    .get("ids")
    ?.split(",")
    .map((item) => Number(item.trim()));

  if (!idsParam) {
    return <Title description={"Нет купленных товаров"} />;
  }

  const { data, isSuccess } = useGetGoodListByIdsQuery(idsParam);

  return (
    <div className={Style.SuccessBuy}>
      <Container>
        <Title description={"Спасибо за покупку!"} />
        <h2 className={Style.SuccessBuy__subtitle}>Купленные товары:</h2>
        <div className={Style.SuccessBuy__goodList}>
          {data?.map((item: GoodsItem) => (
            <GoodCard key={item.id} item={item} />
          ))}{" "}
        </div>
      </Container>
    </div>
  );
}

function GoodCard({ item }: { item: GoodsItem }) {
  const [isDefaultImg, setIsDefaultImg] = useState(false);
  return (
    <>
      <div className={Style.GoodCard}>
        <img
          className={Style.GoodCard__img}
          src={isDefaultImg ? "/Goods/default.webp" : item.imgUrl}
          alt={item.name}
          onError={() => {
            setIsDefaultImg(true);
          }}
        />
        <div className={Style.GoodCard__info}>
          <h3 className={Style.GoodCard__title}>{item.name}</h3>
        </div>
      </div>
    </>
  );
}
