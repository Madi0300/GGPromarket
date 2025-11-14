import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import type { GoodsItem } from "@/types/goods";
import Style from "./Admin.module.scss";
import {
  useGetArticlesDataQuery,
  useGetBrandsDataQuery,
  useGetGoodsDataQuery,
  useGetSEODataQuery,
  useGetServerUrlQuery,
} from "#/apiSlise";

type SectionKey = "goods" | "articles";

const initialGoodForm = {
  name: "",
  href: "#",
  category: "",
  country: "",
  price: "",
  discount: "",
  imgUrl: "",
  rate: "",
  commentsSum: "",
  description: "",
  isHit: false,
};

const initialArticleForm = {
  title: "",
  imgUrl: "",
  link: "#",
};

type ArticleItem = {
  id: number;
  title: string;
  imgUrl: string;
  link: string;
};

export default function Admin() {
  const [code, setCode] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<SectionKey>("goods");
  const [selectedGoodId, setSelectedGoodId] = useState<number | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [goodForm, setGoodForm] = useState(initialGoodForm);
  const [articleForm, setArticleForm] = useState(initialArticleForm);
  const [operationStatus, setOperationStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [imageUploadState, setImageUploadState] = useState<{
    section: SectionKey | null;
    state: "idle" | "uploading" | "success" | "error";
    message: string;
  }>({ section: null, state: "idle", message: "" });
  const [customSidebarText, setCustomSidebarText] = useState("");
  const [customSidebarImage, setCustomSidebarImage] = useState<string | null>(
    null
  );

  const serverUrlQuery = useGetServerUrlQuery(null);
  const serverUrl = serverUrlQuery.data?.serverUrl ?? "";
  const goodsQuery = useGetGoodsDataQuery(null, { skip: !isUnlocked });
  const articlesQuery = useGetArticlesDataQuery(null, { skip: !isUnlocked });
  const brandsQuery = useGetBrandsDataQuery(null, { skip: !isUnlocked });
  const seoQuery = useGetSEODataQuery(null, { skip: !isUnlocked });

  const goods: GoodsItem[] = goodsQuery.data ?? [];
  const articles: ArticleItem[] = articlesQuery.data ?? [];

  useEffect(() => {
    if (selectedGoodId != null && goods.length) {
      const found = goods.find(item => item.id === selectedGoodId);
      if (found) {
        setGoodForm({
          name: found.name,
          href: found.href,
          category: found.category,
          country: found.country,
          price: found.price.toString(),
          discount: found.discount != null ? found.discount.toString() : "",
          imgUrl: found.imgUrl,
          rate: found.rate.toString(),
          commentsSum: found.commentsSum.toString(),
          description: found.description ?? "",
          isHit: Boolean(found.isHit),
        });
        return;
      }
    }

    setGoodForm(initialGoodForm);
    if (selectedGoodId != null) {
      setSelectedGoodId(null);
    }
  }, [selectedGoodId, goods]);

  useEffect(() => {
    if (selectedArticleId != null && articles.length) {
      const found = articles.find(item => item.id === selectedArticleId);
      if (found) {
        setArticleForm({
          title: found.title,
          imgUrl: found.imgUrl,
          link: found.link,
        });
        return;
      }
    }

    setArticleForm(initialArticleForm);
    if (selectedArticleId != null) {
      setSelectedArticleId(null);
    }
  }, [selectedArticleId, articles]);

  useEffect(() => {
    if (seoQuery.data?.text) {
      setCustomSidebarText(seoQuery.data.text);
    }
    if (seoQuery.data?.imgUrl && !customSidebarImage) {
      setCustomSidebarImage(seoQuery.data.imgUrl);
    }
  }, [seoQuery.data, customSidebarImage]);

  const statCards = useMemo(
    () => [
      {
        label: "Товары",
        value: goodsQuery.isLoading ? "..." : goods.length,
        hint: "Записей в каталоге",
      },
      {
        label: "Бренды",
        value: brandsQuery.isLoading ? "..." : brandsQuery.data?.length ?? 0,
        hint: "Партнёров на витрине",
      },
      {
        label: "Статьи",
        value: articlesQuery.isLoading ? "..." : articles.length,
        hint: "Публикаций в блоге",
      },
    ],
    [
      goods.length,
      goodsQuery.isLoading,
      brandsQuery.data?.length,
      brandsQuery.isLoading,
      articles.length,
      articlesQuery.isLoading,
    ]
  );

  const sendAdminRequest = async (path: string, method: string, body: unknown) => {
    if (!serverUrl) {
      throw new Error("Не удалось определить адрес API.");
    }

    if (!adminCode) {
      throw new Error("Сначала подтвердите код администратора.");
    }

    const response = await fetch(`${serverUrl}/api${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-ADMIN-CODE": adminCode,
      },
      body: JSON.stringify(body),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.message || "Ошибка сервера");
    }

    return payload;
  };

  const uploadImage = async (file: File) => {
    if (!serverUrl) {
      throw new Error("Не удалось определить адрес API.");
    }

    if (!adminCode) {
      throw new Error("Сначала подтвердите код администратора.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${serverUrl}/api/admin/upload`, {
      method: "POST",
      headers: {
        "X-ADMIN-CODE": adminCode,
      },
      body: formData,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.message || "Не удалось загрузить изображение.");
    }

    return payload;
  };

  const handleImageUpload = async (file: File | null, target: SectionKey) => {
    if (!file) return;

    setImageUploadState({
      section: target,
      state: "uploading",
      message: "Загрузка изображения...",
    });

    try {
      const payload = await uploadImage(file);
      const remotePath = payload?.path ?? payload?.url ?? "";

      if (!remotePath) {
        throw new Error("Адрес изображения не получен.");
      }

      if (target === "goods") {
        setGoodForm(prev => ({ ...prev, imgUrl: remotePath }));
      } else {
        setArticleForm(prev => ({ ...prev, imgUrl: remotePath }));
      }

      if (target === "goods" && !customSidebarImage) {
        setCustomSidebarImage(remotePath);
      }

      setImageUploadState({
        section: target,
        state: "success",
        message: "Изображение успешно загружено.",
      });
    } catch (uploadError) {
      setImageUploadState({
        section: target,
        state: "error",
        message: uploadError instanceof Error ? uploadError.message : "Не удалось загрузить файл.",
      });
    }
  };

  const uploadFeedback = (section: SectionKey) =>
    imageUploadState.section === section ? imageUploadState : null;

  const goodsUploadFeedback = uploadFeedback("goods");
  const articlesUploadFeedback = uploadFeedback("articles");

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!serverUrl) {
      setError("Сервер ещё не ответил, обновите страницу.");
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/api/admin/check-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const payload = await response.json().catch(() => ({}));

      if (response.ok && payload.valid) {
        setAdminCode(code.trim());
        setIsUnlocked(true);
        setCode("");
        setError("");
        setOperationStatus({ type: "success", message: "Доступ подтверждён. Вы в админке." });
        return;
      }

      setError(payload.message || "Неверный секретный код.");
    } catch (fetchError) {
      console.error(fetchError);
      setError("Не удалось проверить код. Попробуйте ещё раз.");
    }
  };

  const handleGoodsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOperationStatus(null);

    const method = selectedGoodId ? "PUT" : "POST";
    const path = selectedGoodId ? `/admin/goods/${selectedGoodId}` : "/admin/goods";

    try {
      const payload = await sendAdminRequest(path, method, goodForm);
      const message = selectedGoodId
        ? "Товар обновлён"
        : `Товар добавлен (ID ${payload?.id ?? "?"})`;
      setOperationStatus({ type: "success", message });
      goodsQuery.refetch();
      if (!selectedGoodId && payload?.id) {
        setSelectedGoodId(Number(payload.id));
      }
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Не удалось сохранить товар.";
      setOperationStatus({ type: "error", message });
    }
  };

  const handleArticlesSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOperationStatus(null);

    const method = selectedArticleId ? "PUT" : "POST";
    const path = selectedArticleId ? `/admin/articles/${selectedArticleId}` : "/admin/articles";

    try {
      await sendAdminRequest(path, method, articleForm);
      const message = selectedArticleId ? "Статья обновлена" : "Статья опубликована";
      setOperationStatus({ type: "success", message });
      articlesQuery.refetch();
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Не удалось сохранить статью.";
      setOperationStatus({ type: "error", message });
    }
  };

  const handleGoodSelection = (id: number) => {
    if (selectedGoodId === id) {
      setSelectedGoodId(null);
      return;
    }

    setSelectedGoodId(id);
  };

  const handleArticleSelection = (id: number) => {
    if (selectedArticleId === id) {
      setSelectedArticleId(null);
      return;
    }

    setSelectedArticleId(id);
  };

  const clearGoodForm = () => {
    setSelectedGoodId(null);
    setGoodForm(initialGoodForm);
  };

  const clearArticleForm = () => {
    setSelectedArticleId(null);
    setArticleForm(initialArticleForm);
  };

  const handleSidebarTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCustomSidebarText(event.target.value);
  };

  const handleSidebarImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setCustomSidebarImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const renderGoodsList = () => {
    if (goodsQuery.isLoading) {
      return <p className={Style.Admin__listHint}>Загружаем товары...</p>;
    }

    return goods.map((item: GoodsItem) => (
      <button
        type="button"
        key={item.id}
        className={`${Style.Admin__listItem} ${
          selectedGoodId === item.id ? Style["Admin__listItem--active"] : ""
        }`}
        onClick={() => handleGoodSelection(item.id)}
      >
        <img src={item.imgUrl} alt={item.name} className={Style.Admin__listThumb} />
        <div className={Style.Admin__listMeta}>
          <div className={Style.Admin__listTitle}>{item.name}</div>
          <div className={Style.Admin__listSubline}>
            #{item.id} • {item.category} • {item.country}
          </div>
        </div>
        <div className={Style.Admin__listBadge}>
          <span>{item.price.toLocaleString()} ₽</span>
          {item.discount && item.discount < item.price ? (
            <small>акция {item.discount.toLocaleString()} ₽</small>
          ) : null}
        </div>
      </button>
    ));
  };

  const renderArticlesList = () => {
    if (articlesQuery.isLoading) {
      return <p className={Style.Admin__listHint}>Загружаем статьи...</p>;
    }

    return articles.map((item: ArticleItem) => (
      <button
        type="button"
        key={item.id}
        className={`${Style.Admin__listItem} ${
          selectedArticleId === item.id ? Style["Admin__listItem--active"] : ""
        }`}
        onClick={() => handleArticleSelection(item.id)}
      >
        <div className={Style.Admin__listMeta}>
          <div className={Style.Admin__listTitle}>{item.title}</div>
          <div className={Style.Admin__listSubline}>#{item.id}</div>
        </div>
        <div className={Style.Admin__listBadge}>
          <span>{item.link || "—"}</span>
        </div>
      </button>
    ));
  };

  return (
    <main className={Style.Admin__page}>
      <div className={Style.Admin__container}>
        {!isUnlocked ? (
          <section className={Style.Admin__loginPanel}>
            <div className={Style.Admin__loginCard}>
              <p className={Style.Admin__eyebrow}>Административный доступ</p>
              <h1 className={Style.Admin__loginTitle}>Введите секретный код</h1>
              <p className={Style.Admin__loginDescription}>
                После подтверждения вы получите доступ к рабочим карточкам управления
                товарным каталогом и блогом.
              </p>
              <form className={Style.Admin__loginForm} onSubmit={handleAuthSubmit}>
                <label className={Style.Admin__label} htmlFor="admin-code">
                  Секретный код
                </label>
                <input
                  id="admin-code"
                  className={Style.Admin__input}
                  type="password"
                  value={code}
                  onChange={event => setCode(event.target.value)}
                  placeholder="Введите код доступа"
                />
                <button className={Style.Admin__submitButton} type="submit">
                  Подтвердить
                </button>
                {error ? <p className={Style.Admin__status}>{error}</p> : null}
              </form>
            </div>
          </section>
        ) : (
          <section className={Style.Admin__workspace}>
            <header className={Style.Admin__header}>
              <div>
                <p className={Style.Admin__eyebrow}>Суперпанель</p>
                <h1 className={Style.Admin__title}>Управление контентом</h1>
                <p className={Style.Admin__subtitle}>
                  {seoQuery.data?.title || "SEO-заголовок пока не загружен"}
                </p>
              </div>
              <div className={Style.Admin__metaGroup}>
                <div>
                  <p className={Style.Admin__metaLabel}>API</p>
                  <p className={Style.Admin__metaValue}>{serverUrl || "..."}</p>
                </div>
                <div>
                  <p className={Style.Admin__metaLabel}>Статус доступа</p>
                  <p className={Style.Admin__metaValue}>{"Разрешён"}</p>
                </div>
              </div>
            </header>

            <div className={Style.Admin__statsGrid}>
              {statCards.map(card => (
                <article key={card.label} className={Style.Admin__statBlock}>
                  <p className={Style.Admin__statLabel}>{card.label}</p>
                  <p className={Style.Admin__statValue}>{card.value}</p>
                  <p className={Style.Admin__statHint}>{card.hint}</p>
                </article>
              ))}
            </div>

            <div className={Style.Admin__tabBar}>
              {[
                { key: "goods" as SectionKey, label: "Каталог товаров" },
                { key: "articles" as SectionKey, label: "Блог и статьи" },
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  className={`${Style.Admin__tab} ${
                    activeSection === tab.key ? Style["Admin__tab--active"] : ""
                  }`}
                  onClick={() => {
                    setActiveSection(tab.key);
                    setOperationStatus(null);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={Style.Admin__workspaceBody}>
              <div className={Style.Admin__panel}>
                {operationStatus ? (
                  <div
                    className={`${Style.Admin__status} ${
                      operationStatus.type === "error"
                        ? Style["Admin__status--error"]
                        : Style["Admin__status--success"]
                    }`}
                  >
                    {operationStatus.message}
                  </div>
                ) : null}

              {activeSection === "goods" ? (
                  <>
                    <h2 className={Style.Admin__sectionTitle}>Каталог товаров</h2>
                    <div className={Style.Admin__panelGrid}>
                      <div className={Style.Admin__listColumn}>
                        {renderGoodsList()}
                      </div>
                      <form className={Style.Admin__detailPanel} onSubmit={handleGoodsSubmit}>
                        <div className={Style.Admin__formGrid}>
                          <div className={Style.Admin__fieldGroup}>
                            <label className={Style.Admin__label}>Название</label>
                            <input
                              className={Style.Admin__input}
                              value={goodForm.name}
                              onChange={event =>
                                setGoodForm(prev => ({ ...prev, name: event.target.value }))
                              }
                              placeholder="Название товара"
                              required
                            />
                          </div>
                          <div className={Style.Admin__fieldGroup}>
                            <label className={Style.Admin__label}>Категория</label>
                            <input
                              className={Style.Admin__input}
                              value={goodForm.category}
                              onChange={event =>
                                setGoodForm(prev => ({ ...prev, category: event.target.value }))
                              }
                              placeholder="Наименование категории"
                            />
                          </div>
                          <div className={Style.Admin__fieldGroup}>
                            <label className={Style.Admin__label}>Страна</label>
                            <input
                              className={Style.Admin__input}
                              value={goodForm.country}
                              onChange={event =>
                                setGoodForm(prev => ({ ...prev, country: event.target.value }))
                              }
                              placeholder="Производитель / страна"
                            />
                          </div>
                          <div className={Style.Admin__fieldGroup}>
                            <label className={Style.Admin__label}>Ссылка</label>
                            <input
                              className={Style.Admin__input}
                              value={goodForm.href}
                              onChange={event =>
                                setGoodForm(prev => ({ ...prev, href: event.target.value }))
                              }
                              placeholder="#"
                            />
                          </div>

                          <div className={Style.Admin__fieldGroup}>
                            <label className={Style.Admin__label}>Цена (₽)</label>
                            <input
                              type="number"
                              className={Style.Admin__input}
                              value={goodForm.price}
                              onChange={event =>
                                setGoodForm(prev => ({ ...prev, price: event.target.value }))
                              }
                              min="0"
                              step="10"
                            />
                          </div>
                          <div className={Style.Admin__fieldGroup}>
                            <label className={Style.Admin__label}>Скидка (₽)</label>
                            <input
                              type="number"
                              className={Style.Admin__input}
                              value={goodForm.discount}
                              onChange={event =>
                                setGoodForm(prev => ({ ...prev, discount: event.target.value }))
                              }
                              min="0"
                              step="10"
                            />
                          </div>
                          <div className={Style.Admin__fieldGroup}>
                            <label className={Style.Admin__label}>Рейтинг</label>
                            <input
                              type="number"
                              className={Style.Admin__input}
                              value={goodForm.rate}
                              onChange={event =>
                                setGoodForm(prev => ({ ...prev, rate: event.target.value }))
                              }
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div className={Style.Admin__fieldGroup}>
                            <label className={Style.Admin__label}>Отзывы</label>
                            <input
                              type="number"
                              className={Style.Admin__input}
                              value={goodForm.commentsSum}
                              onChange={event =>
                                setGoodForm(prev => ({
                                  ...prev,
                                  commentsSum: event.target.value,
                                }))
                              }
                              min="0"
                            />
                          </div>
                          <div className={Style.Admin__fieldGroup}>
                            <label className={Style.Admin__label}>Ссылка на изображение</label>
                            <input
                              className={Style.Admin__input}
                              value={goodForm.imgUrl}
                              onChange={event =>
                                setGoodForm(prev => ({ ...prev, imgUrl: event.target.value }))
                              }
                              placeholder="/images/goods/1/image.webp"
                            />
                          </div>
                          <div className={Style.Admin__uploadRow}>
                            <label className={Style.Admin__label}>
                              Или загрузите файл
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              className={Style.Admin__fileInput}
                              onChange={event =>
                                handleImageUpload(
                                  event.target.files ? event.target.files[0] : null,
                                  "goods"
                                )
                              }
                            />
                            {goodsUploadFeedback ? (
                              <p
                                className={`${Style.Admin__uploadFeedback} ${
                                  Style[`Admin__uploadFeedback--${goodsUploadFeedback.state}`]
                                }`}
                              >
                                {goodsUploadFeedback.message}
                              </p>
                            ) : null}
                          </div>
                          <div className={Style.Admin__fieldGroup}>
                            <label className={Style.Admin__label}>Описание</label>
                            <textarea
                              className={Style.Admin__textarea}
                              value={goodForm.description}
                              onChange={event =>
                                setGoodForm(prev => ({ ...prev, description: event.target.value }))
                              }
                              rows={3}
                              placeholder="Описание товара, которое появится в модальном окне"
                            />
                          </div>
                        </div>
                        <div className={Style.Admin__switchRow}>
                          <label className={Style.Admin__label}>
                            <input
                              type="checkbox"
                              checked={goodForm.isHit}
                              onChange={event =>
                                setGoodForm(prev => ({ ...prev, isHit: event.target.checked }))
                              }
                            />
                            Позвать ХИТ
                          </label>
                        </div>
                        <div className={Style.Admin__actions}>
                          <button
                            type="button"
                            className={Style.Admin__secondaryButton}
                            onClick={clearGoodForm}
                          >
                            Сбросить
                          </button>
                          <button className={Style.Admin__submitButton} type="submit">
                            {selectedGoodId ? "Сохранить товар" : "Добавить товар"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className={Style.Admin__sectionTitle}>Статьи и публикации</h2>
                    <div className={Style.Admin__panelGrid}>
                      <div className={Style.Admin__listColumn}>
                        {renderArticlesList()}
                      </div>
                      <form className={Style.Admin__detailPanel} onSubmit={handleArticlesSubmit}>
                        <div className={Style.Admin__formGrid}>
                          <div className={Style.Admin__fieldGroup}>
                            <label className={Style.Admin__label}>Название статьи</label>
                            <input
                              className={Style.Admin__input}
                              value={articleForm.title}
                              onChange={event =>
                                setArticleForm(prev => ({ ...prev, title: event.target.value }))
                              }
                              required
                            />
                          </div>
                          <div className={Style.Admin__fieldGroup}>
                            <label className={Style.Admin__label}>Ссылка на изображение</label>
                            <input
                              className={Style.Admin__input}
                              value={articleForm.imgUrl}
                              onChange={event =>
                                setArticleForm(prev => ({ ...prev, imgUrl: event.target.value }))
                              }
                              placeholder="/images/articles/1/image.webp"
                            />
                          </div>
                          <div className={Style.Admin__uploadRow}>
                            <label className={Style.Admin__label}>
                              Или загрузите файл
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              className={Style.Admin__fileInput}
                              onChange={event =>
                                handleImageUpload(
                                  event.target.files ? event.target.files[0] : null,
                                  "articles"
                                )
                              }
                            />
                            {articlesUploadFeedback ? (
                              <p
                                className={`${Style.Admin__uploadFeedback} ${
                                  Style[
                                    `Admin__uploadFeedback--${articlesUploadFeedback.state}`
                                  ]
                                }`}
                              >
                                {articlesUploadFeedback.message}
                              </p>
                            ) : null}
                          </div>
                          <div className={Style.Admin__fieldGroup}>
                            <label className={Style.Admin__label}>Ссылка</label>
                            <input
                              className={Style.Admin__input}
                              value={articleForm.link}
                              onChange={event =>
                                setArticleForm(prev => ({ ...prev, link: event.target.value }))
                              }
                              placeholder="/articles/new"
                            />
                          </div>
                        </div>
                        <div className={Style.Admin__actions}>
                          <button
                            type="button"
                            className={Style.Admin__secondaryButton}
                            onClick={clearArticleForm}
                          >
                            Сбросить
                          </button>
                          <button className={Style.Admin__submitButton} type="submit">
                            {selectedArticleId ? "Сохранить статью" : "Создать статью"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </div>
            <aside className={Style.Admin__sidebar}>
              <div className={Style.Admin__sidebarBlock}>
                <p className={Style.Admin__sidebarLabel}>Изменяемый блок</p>
                <label className={Style.Admin__sidebarLabel}>Текст блока</label>
                <textarea
                  className={Style.Admin__sidebarTextarea}
                  value={customSidebarText}
                  onChange={handleSidebarTextChange}
                />
                <label className={Style.Admin__sidebarLabel}>Фон-изображение</label>
                <input
                  className={Style.Admin__sidebarImageInput}
                  type="file"
                  accept="image/*"
                  onChange={handleSidebarImageUpload}
                />
                {customSidebarImage ? (
                  <div className={Style.Admin__sidebarImagePreview}>
                    <img
                      src={customSidebarImage}
                      alt="Превью блока"
                      className={Style.Admin__sidebarImage}
                    />
                  </div>
                ) : null}
              </div>
              <div className={Style.Admin__sidebarDivider}></div>
              <p className={Style.Admin__sidebarTitle}>Действия</p>
              <button
                type="button"
                className={Style.Admin__secondaryButton}
                onClick={activeSection === "goods" ? clearGoodForm : clearArticleForm}
              >
                + Создать новую запись
              </button>
              <div className={Style.Admin__sidebarDivider}></div>
              <div className={Style.Admin__metaBlock}>
                <p className={Style.Admin__metaLabel}>SEO-текст</p>
                <p className={Style.Admin__metaValue}>
                  {seoQuery.data?.text?.slice(0, 120) || "Описание пока не загружено"}
                  …
                </p>
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
