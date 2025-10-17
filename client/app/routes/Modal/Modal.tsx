import Style from "./Modal.module.scss";
import { useGetGoodDataByIdQuery, useGetServerUrlQuery } from "#/apiSlise";
import { useAppDispatch, useAppSelector } from "#/hooks";

import { useState, useEffect } from "react";
import { Rate } from "@/headerBoard/ui";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

export default function Modal() {
  const params = useParams();
  const { productId: id } = params;
  const isOpen = typeof id === "string";
  const [isDefaultImg, setIsDefaultImg] = useState(false);
  let serverUrl;
  () => {
    const { data, isSuccess } = useGetServerUrlQuery(null);
    if (isSuccess) {
      serverUrl = data;
    }
  };

  const defaultImg = "/Goods/default.png";

  const { data, isSuccess, isError, error } = useGetGoodDataByIdQuery(`${id}`);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  function close() {
    navigate("/", { preventScrollReset: true });
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
                    <form
                      className={Style.Modal__form}
                      method="post"
                      action={serverUrl + "/api/purchase"}
                    >
                      <input type="hidden" name="id" value={data.id} />
                      <button
                        className={
                          Style.Modal__form__button +
                          " " +
                          Style.Modal__form__button__buy
                        }
                      >
                        Купить сейчас
                      </button>
                    </form>
                    <form
                      className={Style.Modal__form}
                      method="post"
                      action={serverUrl + "/api/purchase"}
                    >
                      <input type="hidden" name="id" value={data.id} />
                      <button
                        className={
                          Style.Modal__form__button +
                          " " +
                          Style.Modal__form__button__add
                        }
                      >
                        В корзину
                      </button>
                    </form>
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
