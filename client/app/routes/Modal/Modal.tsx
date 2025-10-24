import Style from "./Modal.module.scss";
import { useGetGoodDataByIdQuery, useGetServerUrlQuery } from "#/apiSlise";
import { useAppDispatch, useAppSelector } from "#/hooks";

import { useState, useEffect, type ReactEventHandler } from "react";
import { Rate } from "@/headerBoard/ui";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { toggleCart } from "#/clientStates";

export default function Modal() {
  const params = useParams();
  const { productId: id } = params;
  const numericId = Number(id);
  const isOpen = typeof id === "string";
  const [isDefaultImg, setIsDefaultImg] = useState(false);
  const { data: serverUrlData, isSuccess: isServerUrlSuccess } =
    useGetServerUrlQuery(null);
  const serverUrl = isServerUrlSuccess ? serverUrlData.serverUrl : "";

  const defaultImg = import.meta.env.BASE_URL + "Goods/default.png";

  const { data, isSuccess, isError, error } = useGetGoodDataByIdQuery(`${id}`);

  const isInCart = useAppSelector(
    (state) => state.clientState.cartItems
  ).includes(numericId);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  function close() {
    navigate("/", { preventScrollReset: true });
  }

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!serverUrl || !data) return;

    const formData = new FormData();
    formData.append("id", data.id.toString());

    await fetch(`${serverUrl}/api/purchase`, {
      method: "POST",
      body: formData,
    });
  }
  function toggleItemToCart(e: React.MouseEvent) {
    e.preventDefault();
    dispatch(toggleCart(numericId));
  }

  useEffect(() => {
    setIsDefaultImg(false);
  }, [id]);

  return (
    <>
      {isOpen ? (
        <div className={Style.Modal__wrapper}>
          <div key={id} className={Style.Modal}>
            <div className={Style.Modal__close} onClick={close}>
              <span className={Style.Modal__close__span}></span>
              <span className={Style.Modal__close__span}></span>
            </div>
            {isSuccess ? (
              <>
                <div className={Style.Modal__imgWrapper}>
                  <img
                    src={!isDefaultImg ? data.imgUrl : defaultImg}
                    alt={data.name}
                    className={Style.Modal__img}
                    onError={() => {
                      setIsDefaultImg(true);
                    }}
                  />
                  <div className={Style.Modal__signs}>
                    {data.isHit ? (
                      <div className={Style.Modal__isHit}>ХИТ</div>
                    ) : null}
                    {data.discount != null && data.discount < data.price ? (
                      <div className={Style.Modal__isDiscount}>АКЦИЯ</div>
                    ) : null}
                  </div>
                </div>
                <div className={Style.Modal__contentWrapper}>
                  <div className={Style.Modal__content}>
                    <h3 className={Style.Modal__title}>{data.name}</h3>
                    <Rate rateSum={data.rate} commentsSum={data.commentsSum} />
                    <div className={Style.Modal__category}>{data.category}</div>
                    <div className={Style.Modal__info}>
                      <div className={Style.Modal__info__price}>
                        {data.discount != null && data.discount < data.price
                          ? data.discount + " ₽"
                          : data.price + " ₽"}
                      </div>
                      {data.discount != null && data.discount < data.price ? (
                        <div className={Style.Modal__info__discount}>
                          {data.discount < data.price
                            ? data.price + " ₽"
                            : data.discount + " ₽"}
                        </div>
                      ) : null}
                      <div className={Style.Modal__info__country}>
                        {data.country}
                      </div>
                    </div>
                    <p className={Style.Modal__description}>
                      {data.description}
                    </p>
                  </div>
                  <div className={Style.Modal__forms}>
                    <button
                      onClick={handleSubmit}
                      className={
                        Style.Modal__form__button +
                        " " +
                        Style.Modal__form__button__buy
                      }
                    >
                      Купить сейчас
                    </button>
                    <button
                      onClick={toggleItemToCart}
                      className={
                        Style.Modal__form__button +
                        " " +
                        Style.Modal__form__button__add
                      }
                    >
                      {isInCart ? "В корзине" : "В корзину"}
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
