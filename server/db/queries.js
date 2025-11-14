const db = require('./database');

const getArticles = () =>
  db
    .prepare('SELECT id, title, img_url AS imgUrl, link FROM articles ORDER BY id')
    .all();

const getBrands = () =>
  db
    .prepare('SELECT name, img_url AS imgUrl, link FROM brands ORDER BY id')
    .all();

const getCollections = () => {
  const rows = db
    .prepare(
      'SELECT slot, title, autor, img_src AS imgSrc, href FROM collections ORDER BY position'
    )
    .all();

  return rows.reduce((acc, row) => {
    acc[row.slot] = {
      title: row.title,
      autor: row.autor,
      imgSrc: row.imgSrc,
      href: row.href,
    };
    return acc;
  }, {});
};

const getFooter = () => {
  const productLinks = db
    .prepare(
      `SELECT name, href FROM footer_links WHERE section = 'product' ORDER BY position`
    )
    .all();
  const infoLinks = db
    .prepare(`SELECT name, href FROM footer_links WHERE section = 'info' ORDER BY position`)
    .all();
  const socialMediaLinks = db
    .prepare('SELECT name, href, img FROM footer_social_links ORDER BY position')
    .all()
    .map(item => ({ name: item.name, href: item.href, img: item.img }));
  const meta = db
    .prepare(
      'SELECT adress, email, rate_href AS rateHref, rate_img AS rateImg, rate_alt AS rateAlt FROM footer_meta WHERE id = 1'
    )
    .get();

  return {
    productLinks,
    infoLinks,
    socialMediaLinks,
    adress: meta?.adress || '',
    email: meta?.email || '',
    rate: {
      href: meta?.rateHref || '#',
      imgUrl: meta?.rateImg || '',
      alt: meta?.rateAlt || '',
    },
  };
};

const getHeader = () => {
  const info = db
    .prepare(
      'SELECT current_location AS currentLocation, call_number AS callNumber FROM header_info WHERE id = 1'
    )
    .get();
  const productCatalog = db
    .prepare('SELECT name, href FROM header_catalog ORDER BY position')
    .all();
  const notifications = db
    .prepare('SELECT key, value FROM header_notifications')
    .all()
    .reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

  return {
    currentLocation: info?.currentLocation || '',
    callNumber: info?.callNumber ? Number(info.callNumber) : '',
    productCatalog,
    notificationSum: notifications,
  };
};

const getHero = () => {
  const heroItems = db
    .prepare('SELECT id, title, subtitle, link, img_url AS imgUrl FROM hero_items ORDER BY id')
    .all();
  const heroSidebarItems = db
    .prepare(
      'SELECT title, link, img_url AS imgUrl FROM hero_sidebar_items ORDER BY position'
    )
    .all();

  return { heroItems, heroSidebarItems };
};

const getIcons = () =>
  db.prepare('SELECT key, icon, text FROM icons ORDER BY position').all();

const getSeo = () =>
  db.prepare('SELECT title, text, img_url AS imgUrl FROM seo_data WHERE id = 1').get();

const getGoodsOverview = () =>
  db
    .prepare(
      `SELECT id, name, href, country, price, discount, img_url AS imgUrl, rate, comments_sum AS commentsSum, is_hit AS isHit, category
       FROM goods ORDER BY id`
    )
    .all()
    .map(item => ({ ...item, isHit: Boolean(item.isHit) }));

const getGoodById = id => {
  const record = db
    .prepare(
      `SELECT id, name, href, country, price, discount, img_url AS imgUrl, rate, comments_sum AS commentsSum, is_hit AS isHit, category, description
       FROM goods WHERE id = ?`
    )
    .get(id);
  return record ? { ...record, isHit: Boolean(record.isHit) } : null;
};

const getArticleById = id =>
  db
    .prepare('SELECT id, title, img_url AS imgUrl, link FROM articles WHERE id = ?')
    .get(id);

const parseNumberField = (value, fallback = null) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeGoodData = input => {
  const price = parseNumberField(input.price, 0);
  const discount = parseNumberField(input.discount, null);
  const rate = parseNumberField(input.rate, 0);
  const commentsSum = parseNumberField(input.commentsSum, 0);

  return {
    name: (input.name ?? "").toString().trim() || "Новый товар",
    href: (input.href ?? "#").toString().trim(),
    country: (input.country ?? "Не указано").toString().trim(),
    price,
    discount,
    imgUrl:
      (input.imgUrl ?? "").toString().trim() ||
      "https://via.placeholder.com/640x480?text=GG+Promarket",
    rate,
    commentsSum,
    isHit: input.isHit ? 1 : 0,
    category: (input.category ?? "Разное").toString().trim(),
    description:
      (input.description ?? "Описание товара отсутствует").toString().trim(),
  };
};

const normalizeArticleData = input => ({
  title: (input.title ?? "Новая статья").toString().trim(),
  imgUrl:
    (input.imgUrl ?? "").toString().trim() ||
    "https://via.placeholder.com/1100x600?text=Статья+GG+Promarket",
  link: (input.link ?? "#").toString().trim(),
});

const createGood = raw => {
  const payload = normalizeGoodData(raw);
  const stmt = db.prepare(
    `INSERT INTO goods
       (name, href, country, price, discount, img_url, rate, comments_sum, is_hit, category, description)
       VALUES (@name, @href, @country, @price, @discount, @imgUrl, @rate, @commentsSum, @isHit, @category, @description)`
  );
  const info = stmt.run(payload);
  return getGoodById(info.lastInsertRowid);
};

const updateGood = (id, raw) => {
  const payload = normalizeGoodData(raw);
  const stmt = db.prepare(
    `UPDATE goods SET
       name = @name,
       href = @href,
       country = @country,
       price = @price,
       discount = @discount,
       img_url = @imgUrl,
       rate = @rate,
       comments_sum = @commentsSum,
       is_hit = @isHit,
       category = @category,
       description = @description
     WHERE id = @id`
  );
  const info = stmt.run({ id, ...payload });
  return info.changes ? getGoodById(id) : null;
};

const createArticle = raw => {
  const payload = normalizeArticleData(raw);
  const stmt = db.prepare(
    `INSERT INTO articles (title, img_url, link)
     VALUES (@title, @imgUrl, @link)`
  );
  const info = stmt.run(payload);
  return getArticleById(info.lastInsertRowid);
};

const updateArticle = (id, raw) => {
  const payload = normalizeArticleData(raw);
  const stmt = db.prepare(
    `UPDATE articles
     SET title = @title, img_url = @imgUrl, link = @link
     WHERE id = @id`
  );
  const info = stmt.run({ id, ...payload });
  return info.changes ? getArticleById(id) : null;
};

module.exports = {
  getArticles,
  getBrands,
  getCollections,
  getFooter,
  getHeader,
  getHero,
  getIcons,
  getSeo,
  getGoodsOverview,
  getGoodById,
  getArticleById,
  createGood,
  updateGood,
  createArticle,
  updateArticle,
};
