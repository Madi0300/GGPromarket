const db = require('./database');

const articles = require('../data/articles');
const brands = require('../data/brands');
const collections = require('../data/collections');
const footer = require('../data/footer');
const goods = require('../data/goods');
const header = require('../data/header');
const hero = require('../data/hero');
const icons = require('../data/icons');
const seo = require('../data/seo');

const createTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      img_url TEXT NOT NULL,
      link TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      img_url TEXT NOT NULL,
      link TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS collections (
      slot TEXT PRIMARY KEY,
      position INTEGER NOT NULL,
      title TEXT NOT NULL,
      autor TEXT NOT NULL,
      img_src TEXT NOT NULL,
      href TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS footer_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      position INTEGER NOT NULL,
      name TEXT NOT NULL,
      href TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS footer_social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      position INTEGER NOT NULL,
      name TEXT NOT NULL,
      href TEXT NOT NULL,
      img TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS footer_meta (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      adress TEXT NOT NULL,
      email TEXT NOT NULL,
      rate_href TEXT NOT NULL,
      rate_img TEXT NOT NULL,
      rate_alt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS header_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      position INTEGER NOT NULL,
      name TEXT NOT NULL,
      href TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS header_info (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      current_location TEXT NOT NULL,
      call_number TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS header_notifications (
      key TEXT PRIMARY KEY,
      value INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hero_items (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      link TEXT NOT NULL,
      img_url TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hero_sidebar_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      position INTEGER NOT NULL,
      title TEXT NOT NULL,
      link TEXT NOT NULL,
      img_url TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS icons (
      key TEXT PRIMARY KEY,
      position INTEGER NOT NULL,
      icon TEXT NOT NULL,
      text TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS seo_data (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      title TEXT NOT NULL,
      text TEXT NOT NULL,
      img_url TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS goods (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      href TEXT NOT NULL,
      country TEXT NOT NULL,
      price INTEGER NOT NULL,
      discount INTEGER,
      img_url TEXT NOT NULL,
      rate REAL NOT NULL,
      comments_sum INTEGER NOT NULL,
      is_hit INTEGER NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL
    );
  `);
};

const seedArticles = () => {
  db.prepare('DELETE FROM articles').run();
  const stmt = db.prepare(
    'INSERT INTO articles (id, title, img_url, link) VALUES (@id, @title, @imgUrl, @link)'
  );
  articles.forEach(article => stmt.run(article));
};

const seedBrands = () => {
  db.prepare('DELETE FROM brands').run();
  const stmt = db.prepare(
    'INSERT INTO brands (name, img_url, link) VALUES (@name, @imgUrl, @link)'
  );
  brands.forEach(brand => stmt.run(brand));
};

const seedCollections = () => {
  db.prepare('DELETE FROM collections').run();
  const stmt = db.prepare(
    'INSERT INTO collections (slot, position, title, autor, img_src, href) VALUES (@slot, @position, @title, @autor, @imgSrc, @href)'
  );
  Object.entries(collections).forEach(([slot, item], index) =>
    stmt.run({ slot, position: index, ...item })
  );
};

const seedFooter = () => {
  db.prepare('DELETE FROM footer_links').run();
  db.prepare('DELETE FROM footer_social_links').run();
  db.prepare('DELETE FROM footer_meta').run();

  const linksStmt = db.prepare(
    'INSERT INTO footer_links (section, position, name, href) VALUES (@section, @position, @name, @href)'
  );

  footer.productLinks.forEach((link, index) =>
    linksStmt.run({ section: 'product', position: index, ...link })
  );
  footer.infoLinks.forEach((link, index) =>
    linksStmt.run({ section: 'info', position: index, ...link })
  );

  const socialStmt = db.prepare(
    'INSERT INTO footer_social_links (position, name, href, img) VALUES (@position, @name, @href, @img)'
  );
  footer.socialMediaLinks.forEach((link, index) =>
    socialStmt.run({ position: index, ...link })
  );

  const metaStmt = db.prepare(
    'INSERT INTO footer_meta (id, adress, email, rate_href, rate_img, rate_alt) VALUES (1, @adress, @email, @rateHref, @rateImg, @rateAlt)'
  );
  metaStmt.run({
    adress: footer.adress,
    email: footer.email,
    rateHref: footer.rate.href,
    rateImg: footer.rate.imgUrl,
    rateAlt: footer.rate.alt,
  });
};

const seedHeader = () => {
  db.prepare('DELETE FROM header_catalog').run();
  db.prepare('DELETE FROM header_info').run();
  db.prepare('DELETE FROM header_notifications').run();

  const catalogStmt = db.prepare(
    'INSERT INTO header_catalog (position, name, href) VALUES (@position, @name, @href)'
  );
  header.productCatalog.forEach((item, index) =>
    catalogStmt.run({ position: index, ...item })
  );

  db.prepare(
    'INSERT INTO header_info (id, current_location, call_number) VALUES (1, @currentLocation, @callNumber)'
  ).run({
    currentLocation: header.currentLocation,
    callNumber: String(header.callNumber),
  });

  const notificationStmt = db.prepare(
    'INSERT INTO header_notifications (key, value) VALUES (@key, @value)'
  );
  Object.entries(header.notificationSum).forEach(([key, value]) =>
    notificationStmt.run({ key, value })
  );
};

const seedHero = () => {
  db.prepare('DELETE FROM hero_items').run();
  db.prepare('DELETE FROM hero_sidebar_items').run();

  const heroStmt = db.prepare(
    'INSERT INTO hero_items (id, title, subtitle, link, img_url) VALUES (@id, @title, @subtitle, @link, @imgUrl)'
  );
  hero.heroItems.forEach(item => heroStmt.run(item));

  const sidebarStmt = db.prepare(
    'INSERT INTO hero_sidebar_items (position, title, link, img_url) VALUES (@position, @title, @link, @imgUrl)'
  );
  hero.heroSidebarItems.forEach((item, index) =>
    sidebarStmt.run({ position: index, ...item })
  );
};

const seedIcons = () => {
  db.prepare('DELETE FROM icons').run();
  const stmt = db.prepare(
    'INSERT INTO icons (key, position, icon, text) VALUES (@key, @position, @icon, @text)'
  );
  icons.forEach((icon, index) => stmt.run({ position: index, ...icon }));
};

const seedSeo = () => {
  db.prepare('DELETE FROM seo_data').run();
  db.prepare(
    'INSERT INTO seo_data (id, title, text, img_url) VALUES (1, @title, @text, @imgUrl)'
  ).run(seo);
};

const seedGoods = () => {
  db.prepare('DELETE FROM goods').run();
  const stmt = db.prepare(
    `INSERT INTO goods (id, name, href, country, price, discount, img_url, rate, comments_sum, is_hit, category, description)
     VALUES (@id, @name, @href, @country, @price, @discount, @imgUrl, @rate, @commentsSum, @isHit, @category, @description)`
  );
  goods.forEach(item =>
    stmt.run({
      ...item,
      isHit: item.isHit ? 1 : 0,
    })
  );
};

const seedDatabase = () => {
  createTables();
  const runAll = db.transaction(() => {
    seedArticles();
    seedBrands();
    seedCollections();
    seedFooter();
    seedHeader();
    seedHero();
    seedIcons();
    seedSeo();
    seedGoods();
  });
  runAll();
};

if (require.main === module) {
  seedDatabase();
  console.log('SQLite database has been created and seeded.');
}

module.exports = seedDatabase;
