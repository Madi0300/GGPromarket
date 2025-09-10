import Style from "./Goods.module.scss";
import { useState, useEffect, useRef } from "react";
import { Title } from "../home";

export type Category =
  | "Sinks"
  | "Baths"
  | "Toilets"
  | "Shower systems"
  | "Faucets"
  | "Mirrors"
  | "Shower cabins"
  | "Washing machines"
  | "Towel dryers"
  | "Bidets"
  | "Heaters"
  | "Dishwashers"
  | "All";

type GoodsItemData = {
  name: string;
  href: string;
  country: string;
  price: number;
  discount?: number | null;
  imgUrl: string;
  rate: number;
  commentsSum: number;
  isHit?: boolean;
  category: Category;
};

const items: GoodsItemData[] = [
  {
    name: "Раковина Roca Debba 32799400Y, 60x48 см",
    href: "#",
    country: "Испания",
    price: 2601,
    discount: null,
    imgUrl: "/Goods/1.png",
    rate: 4.5,
    commentsSum: 12,
    isHit: true,
    category: "Sinks",
  },
  {
    name: "Акриловая ванна AM.PM Bliss L 180x80 W53A-180-080W-ARB",
    href: "#",
    country: "Германия",
    price: 26990,
    discount: 28601,
    imgUrl: "/Goods/2.png",
    rate: 4.5,
    commentsSum: 2,
    isHit: true,
    category: "Baths",
  },
  {
    name: "Душевая система Raiber R0808, хром",
    href: "#",
    country: "Германия",
    price: 12207,
    discount: null,
    imgUrl: "/Goods/3.png",
    rate: 4.5,
    commentsSum: 24,
    isHit: true,
    category: "Shower cabins",
  },
  {
    name: "Унитаз AM.PM Spirit V2.0 C708607SC компакт с сиденьем микролифт",
    href: "#",
    country: "Испания",
    price: 14764,
    discount: null,
    imgUrl: "/Goods/4.png",
    rate: 4.5,
    commentsSum: 4,
    isHit: true,
    category: "Toilets",
  },
  {
    name: "Полотенцесушитель электрический Laris Кватро П7 40x60 см",
    href: "#",
    country: "Россия, Украина",
    price: 12730,
    discount: null,
    imgUrl: "/Goods/5.png",
    rate: 4.5,
    commentsSum: 10,
    isHit: true,
    category: "Towel dryers",
  },
  {
    name: "Смеситель Grohe Eurosmart Cosmopolitan, хром",
    href: "#",
    country: "Германия",
    price: 8850,
    discount: null,
    imgUrl: "/Goods/6.png",
    rate: 4.7,
    commentsSum: 18,
    isHit: true,
    category: "Faucets",
  },
  {
    name: "Зеркало Vitra Frame 80x60 см, с подсветкой",
    href: "#",
    country: "Турция",
    price: 15490,
    discount: 13990,
    imgUrl: "/Goods/7.png",
    rate: 4.3,
    commentsSum: 7,
    category: "Mirrors",
  },
  {
    name: "Сушильная машина Bosch Serie 4 WTN85231OE, 8 кг",
    href: "#",
    country: "Германия",
    price: 119990,
    discount: null,
    imgUrl: "/Goods/8.png",
    rate: 4.8,
    commentsSum: 32,
    isHit: true,
    category: "Washing machines",
  },
  {
    name: "Настенный полотенцесушитель Terminus Виктория 500x800 мм",
    href: "#",
    country: "Россия",
    price: 10250,
    discount: null,
    imgUrl: "/Goods/9.png",
    rate: 4.2,
    commentsSum: 5,
    isHit: true,
    category: "Towel dryers",
  },
  {
    name: "Биде Jacob Delafon Presquile E4781-00, подвесное",
    href: "#",
    country: "Франция",
    price: 23100,
    discount: null,
    imgUrl: "/Goods/10.png",
    rate: 4.6,
    commentsSum: 9,
    isHit: true,
    category: "Bidets",
  },
  {
    name: "Электрокотел Thermex Variant VE 3,0 кВт",
    href: "#",
    country: "Россия",
    price: 18500,
    discount: null,
    imgUrl: "/Goods/11.png",
    rate: 4.1,
    commentsSum: 3,
    category: "Heaters",
  },
  {
    name: "Посудомоечная машина Indesit DSR 15B1 RUS",
    href: "#",
    country: "Италия",
    price: 46990,
    discount: 42990,
    imgUrl: "/Goods/12.png",
    rate: 4.4,
    commentsSum: 14,
    category: "Dishwashers",
  },
  {
    name: "Смеситель Hansgrohe Focus S, для раковины",
    href: "#",
    country: "Германия",
    price: 7550,
    discount: null,
    imgUrl: "/Goods/13.png",
    rate: 4.5,
    commentsSum: 21,
    isHit: true,
    category: "Faucets",
  },
  {
    name: "Душевая кабина Kolpa-San Vista 120x80, правая",
    href: "#",
    country: "Словения",
    price: 67990,
    discount: 64990,
    imgUrl: "/Goods/14.png",
    rate: 4.4,
    commentsSum: 11,
    category: "Shower cabins",
  },
  {
    name: "Раковина Duravit D-Code 65 см, белая",
    href: "#",
    country: "Германия",
    price: 14300,
    discount: null,
    imgUrl: "/Goods/15.png",
    rate: 4.2,
    commentsSum: 6,
    category: "Sinks",
  },
  {
    name: "Акриловая ванна Triton Влада 160x70 см",
    href: "#",
    country: "Россия",
    price: 12490,
    discount: null,
    imgUrl: "/Goods/16.png",
    rate: 4.0,
    commentsSum: 4,
    isHit: true,
    category: "Baths",
  },
  {
    name: "Система душа Oras Optima 2852",
    href: "#",
    country: "Финляндия",
    price: 10200,
    discount: 9500,
    imgUrl: "/Goods/17.png",
    rate: 4.5,
    commentsSum: 13,
    category: "Shower systems",
  },
  {
    name: "Унитаз подвесной Cersanit President CleanOn",
    href: "#",
    country: "Польша",
    price: 12850,
    discount: null,
    imgUrl: "/Goods/18.png",
    rate: 4.3,
    commentsSum: 8,
    category: "Toilets",
  },
  {
    name: "Зеркало Cielo Mood 100x70 см без подсветки",
    href: "#",
    country: "Италия",
    price: 17500,
    discount: 15900,
    imgUrl: "/Goods/19.png",
    rate: 4.6,
    commentsSum: 10,
    category: "Mirrors",
  },
  {
    name: "Стиральная машина Samsung WW70J5555FW, 7 кг",
    href: "#",
    country: "Южная Корея",
    price: 59990,
    discount: 55990,
    imgUrl: "/Goods/20.png",
    rate: 4.7,
    commentsSum: 29,
    category: "Washing machines",
  },
  {
    name: "Полотенцесушитель водяной Zehnder Forma Spa 50x120 см",
    href: "#",
    country: "Швейцария",
    price: 34200,
    discount: null,
    imgUrl: "/Goods/21.png",
    rate: 4.8,
    commentsSum: 17,
    category: "Towel dryers",
  },
  {
    name: "Биде подвесное Roca Meridian, E34747",
    href: "#",
    country: "Испания",
    price: 21900,
    discount: 19900,
    imgUrl: "/Goods/22.png",
    rate: 4.2,
    commentsSum: 5,
    category: "Bidets",
  },
  {
    name: "Конвектор Ballu BEC/EVU-2000",
    href: "#",
    country: "Китай",
    price: 4890,
    discount: null,
    imgUrl: "/Goods/23.png",
    rate: 4.0,
    commentsSum: 2,
    category: "Heaters",
  },
  {
    name: "Посудомоечная машина Bosch Serie 2 SMS2HKI07R",
    href: "#",
    country: "Германия",
    price: 52990,
    discount: null,
    imgUrl: "/Goods/24.png",
    rate: 4.7,
    commentsSum: 22,
    isHit: true,
    category: "Dishwashers",
  },
  {
    name: "Смеситель для душа Ideal Standard Slide",
    href: "#",
    country: "Бельгия",
    price: 8450,
    discount: 7990,
    imgUrl: "/Goods/25.png",
    rate: 4.4,
    commentsSum: 14,
    category: "Shower systems",
  },
  {
    name: "Душевой гарнитур Iddis Slide SLSB00i07",
    href: "#",
    country: "Китай",
    price: 11200,
    discount: null,
    imgUrl: "/Goods/26.png",
    rate: 4.3,
    commentsSum: 9,
    category: "Shower systems",
  },
  {
    name: "Раковина Sanita Luxe 60x45 см, белая",
    href: "#",
    country: "Беларусь",
    price: 5100,
    discount: 4690,
    imgUrl: "/Goods/27.png",
    rate: 4.1,
    commentsSum: 6,
    category: "Sinks",
  },
  {
    name: "Акриловая ванна Aquanet Карина 150x70",
    href: "#",
    country: "Россия",
    price: 15800,
    discount: null,
    imgUrl: "/Goods/28.png",
    rate: 4.2,
    commentsSum: 7,
    category: "Baths",
  },
  {
    name: "Унитаз-компакт Jika Lyra Plus",
    href: "#",
    country: "Швейцария",
    price: 13500,
    discount: 12500,
    imgUrl: "/Goods/29.png",
    rate: 4.6,
    commentsSum: 12,
    isHit: true,
    category: "Toilets",
  },
  {
    name: "Зеркало Aquaton Севилья 70x50 см",
    href: "#",
    country: "Россия",
    price: 6200,
    discount: null,
    imgUrl: "/Goods/30.png",
    rate: 4.0,
    commentsSum: 4,
    isHit: true,
    category: "Mirrors",
  },
];

type CategoryItem = {
  tag: Category;
  text: string;
};

type CategoriesListData = {
  hits: CategoryItem[];
  discounts: CategoryItem[];
};

const dataCategories: CategoriesListData = {
  hits: [
    { tag: "Sinks", text: "Раковины" },
    { tag: "Baths", text: "Ванны" },
    { tag: "Toilets", text: "Унитазы" },
    { tag: "Shower systems", text: "Душевые системы" },
    { tag: "Faucets", text: "Смесители" },
    { tag: "Mirrors", text: "Зеркала" },
    { tag: "Shower cabins", text: "Душевые кабины" },
    { tag: "Washing machines", text: "Стиральные машины" },
  ],
  discounts: [
    { tag: "Faucets", text: "Смесители" },
    { tag: "Towel dryers", text: "Полотенцесушители" },
    { tag: "Bidets", text: "Биде" },
    { tag: "Shower systems", text: "Душевые системы" },
    { tag: "Baths", text: "Ванны" },
    { tag: "Toilets", text: "Унитазы" },
    { tag: "Heaters", text: "Обогреватели" },
    { tag: "Dishwashers", text: "Посудомоечные машины" },
  ],
} as const;

export default function Goods({
  data = items,
  categoriesList = dataCategories,
}: {
  data: GoodsItemData[];
  categoriesList: CategoriesListData;
}) {
  return (
    <>
      <Title description="Хиты продаж" />
      <div className={Style.Goods}>
        <GoodsSlider categories={categoriesList.hits} data={data} />
      </div>
    </>
  );
}

function GoodsSlider({
  data,
  categories,
}: {
  data: GoodsItemData[];
  categories: CategoryItem[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("Любые товары");

  return (
    <>
      <div className={Style.GoodsSlider}>
        <div className={Style.GoodsSlider__categories}>
          <div className={Style.GoodsSlider__category}>Любые товары</div>
          {categories.map((item) => {
            return (
              <div key={item.tag} className={Style.GoodsSlider__category}>
                {item.text}
              </div>
            );
          })}
        </div>
        <div className={Style.GoodsSlider__items}>
          {data.map((item) => (
            <GoodsItem key={item.name} {...item} />
          ))}
        </div>
      </div>
    </>
  );
}

function GoodsItem(props: GoodsItemData) {
  const [isDefaultImg, setIsDefaultImg] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const elem = useRef(null);
  const price = props.price
    .toString()
    .split("")
    .reverse()
    .map((item, index) => {
      if ((index + 1) % 3 == 0 && index != 0) return " " + item;
      else return item;
    })
    .reverse()
    .join("");

  const discount = props.discount
    ? props.discount
        .toString()
        .split("")
        .reverse()
        .map((item, index) => {
          if ((index + 1) % 3 == 0 && index != 0) return " " + item;
          else return item;
        })
        .reverse()
        .join("")
    : null;

  const isDiscount =
    props.discount != undefined &&
    Number.isFinite(props.discount) &&
    props.price - props.discount;

  const discountItem = (
    <p className={Style.GoodsItem__discount}>{discount + " " + "₽"}</p>
  );
  const discountSign = (
    <div className={Style.GoodsItem__discountSign}>АКЦИЯ</div>
  );
  const hitSign = <div className={Style.GoodsItem__hitSign}>ХИТ</div>;

  const GoodItemSigns = (
    <div className={Style.GoodsItem__signs}>
      {props.isHit ? hitSign : null}
      {isDiscount ? discountSign : null}
    </div>
  );

  useEffect(() => {
    if (!elem.current) return;
    if (isVisible) return;
    const element = elem.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [el] = entries;
        if (el.isIntersecting) {
          setIsVisible(true);
          console.log(el + "isShowed");
          observer.unobserve(element);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <a
      ref={elem}
      href={props.href}
      onMouseLeave={() => {
        setIsHover(false);
      }}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      className={Style.GoodsItem + " " + (isHover ? Style.active : "")}
    >
      {isVisible ? (
        <img
          className={Style.GoodsItem__image}
          src={!isDefaultImg ? props.imgUrl : "/Goods/default.png"}
          alt=""
          onError={() => {
            setIsDefaultImg(true);
          }}
        />
      ) : null}
      <div className={Style.GoodsItem__content}>
        <Rate rateSum={props.rate} commentsSum={props.commentsSum} />
        <h4 className={Style.GoodsItem__title}>{props.name}</h4>
        <p className={Style.GoodsItem__country}>{props.country}</p>
        <div className={Style.GoodsItem__info}>
          <p className={Style.GoodsItem__price}>{price + " ₽"}</p>
          <button className={Style.GoodsItem__button}>В корзину</button>
          {Number.isFinite(props.discount) ? discountItem : null}
        </div>
      </div>
      <div className={Style.GoodsItem__hoverBanner}>Быстрый просмотр</div>
      <img src="/Goods/like.svg" alt="like" className={Style.GoodsItem__like} />
      {isDiscount || props.isHit ? GoodItemSigns : null}
    </a>
  );
}

function Rate({
  rateSum,
  commentsSum,
}: {
  rateSum: number;
  commentsSum: number;
}) {
  let curRate = rateSum;

  let stars = [];

  if (rateSum < 0) {
    return;
  }
  for (let i = 1; i <= curRate; curRate--) {
    stars.push(
      <img
        key={5 - curRate}
        src="/Goods/star.svg"
        alt=""
        className={Style.Rate__icon}
      />
    );
  }
  if (curRate > 0) {
    stars.push(
      <img
        key={5 - curRate}
        src="/Goods/halfStar.svg"
        alt=""
        className={Style.Rate__icon}
      />
    );
  }

  return (
    <>
      <div className={Style.Rate}>
        <span className={Style.Rate__stars}>{stars}</span>
        <span className={Style.Rate__comments}>
          <img src="/Goods/commentsIcon.svg" alt="" />
          {rateSum}
        </span>
      </div>
    </>
  );
}
