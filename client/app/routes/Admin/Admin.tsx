import { FormEvent, useMemo, useState } from "react";
import Style from "./Admin.module.scss";
import {
  useGetArticlesDataQuery,
  useGetBrandsDataQuery,
  useGetGoodsDataQuery,
  useGetSEODataQuery,
  useGetServerUrlQuery,
} from "#/apiSlise";

export default function Admin() {
  const [code, setCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");

  const goodsQuery = useGetGoodsDataQuery(null, { skip: !isUnlocked });
  const brandsQuery = useGetBrandsDataQuery(null, { skip: !isUnlocked });
  const articlesQuery = useGetArticlesDataQuery(null, { skip: !isUnlocked });
  const seoQuery = useGetSEODataQuery(null, { skip: !isUnlocked });
  const serverUrlQuery = useGetServerUrlQuery(null);
  const serverUrl = serverUrlQuery.data?.serverUrl ?? "";

  const stats = useMemo(
    () => [
      {
        label: "Товары",
        value: goodsQuery.isLoading ? "..." : goodsQuery.data?.length ?? 0,
        hasError: goodsQuery.isError,
      },
      {
        label: "Бренды",
        value: brandsQuery.isLoading ? "..." : brandsQuery.data?.length ?? 0,
        hasError: brandsQuery.isError,
      },
      {
        label: "Статьи",
        value: articlesQuery.isLoading ? "..." : articlesQuery.data?.length ?? 0,
        hasError: articlesQuery.isError,
      },
    ],
    [goodsQuery, brandsQuery, articlesQuery]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!serverUrl) {
      setError("Не удалось получить адрес API, повторите попытку позже.");
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
        setIsUnlocked(true);
        setError("");
        return;
      }

      setIsUnlocked(false);
      setError(payload.message || "Неверный секретный код.");
    } catch (fetchError) {
      console.error(fetchError);
      setIsUnlocked(false);
      setError("Не удалось проверить код, повторите позже.");
    }
  };

  return (
    <main className={Style.Admin__page}>
      <div className={Style.Admin__card}>
        <div className={Style.Admin__intro}>
          <h1 className={Style.Admin__title}>Админ-панель</h1>
          <p className={Style.Admin__description}>
            Защищённая зона доступна только после ввода секретного кода. Здесь
            можно быстро посмотреть статистику и рабочие ссылки.
          </p>
        </div>
        <form className={Style.Admin__form} onSubmit={handleSubmit}>
          <label className={Style.Admin__label} htmlFor="admin-code">
            Секретный код
          </label>
          <input
            id="admin-code"
            className={Style.Admin__input}
            type="password"
            placeholder="Введите код доступа"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <button className={Style.Admin__button} type="submit">
            Проверить
          </button>
          {error ? <p className={Style.Admin__error}>{error}</p> : null}
          <p className={Style.Admin__hint}>
            Секретный код хранится на сервере в <code>server/.env.local</code> под
            переменной <code>VITE_ADMIN_CODE</code>.
          </p>
        </form>
        {isUnlocked ? (
          <section className={Style.Admin__panel}>
            <h2 className={Style.Admin__panelTitle}>Статистика</h2>
            <div className={Style.Admin__stats}>
              {stats.map((item) => (
                <article
                  key={item.label}
                  className={Style.Admin__statCard}
                  aria-live="polite"
                >
                  <p className={Style.Admin__statLabel}>{item.label}</p>
                  <p className={Style.Admin__statValue}>{item.value}</p>
                  {item.hasError ? (
                    <p className={Style.Admin__statHint}>Ошибка загрузки</p>
                  ) : null}
                </article>
              ))}
            </div>
            <div className={Style.Admin__meta}>
              <div className={Style.Admin__metaItem}>
                <p className={Style.Admin__metaLabel}>SEO-заголовок</p>
                <p className={Style.Admin__metaValue}>
                  {seoQuery.data?.title || "—"}
                </p>
              </div>
              <div className={Style.Admin__metaItem}>
                <p className={Style.Admin__metaLabel}>API-сервер</p>
                <p className={Style.Admin__metaValue}>
                  {serverUrlQuery.data?.serverUrl || "—"}
                </p>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
