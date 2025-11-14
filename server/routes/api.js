const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');
const router = express.Router();
const { toAbsolute, resolveBaseUrl } = require('../utils/urlUtils');
const {
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
  getGoodsCatalog,
  getGoodsFiltersMeta,
  createGood,
  updateGood,
  createArticle,
  updateArticle,
} = require('../db/queries');

const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_, file, cb) => {
    const extension = path.extname(file.originalname) || '.webp';
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, safeName);
  },
});

const upload = multer({ storage });

const ADMIN_HEADER = 'x-admin-code';

const requireAdmin = (req, res, next) => {
  const adminCode = process.env.VITE_ADMIN_CODE?.trim();

  if (!adminCode) {
    return res
      .status(500)
      .json({ message: 'Секретный код администратора не настроен.' });
  }

  const providedCode = (req.headers[ADMIN_HEADER] ?? '').toString().trim();

  if (!providedCode) {
    return res.status(401).json({ message: 'Нет кода администратора.' });
  }

  if (providedCode !== adminCode) {
    return res.status(401).json({ message: 'Неверный код администратора.' });
  }

  next();
};

const sendWithAbsolute = getPayload => (req, res, next) => {
  try {
    const payload = typeof getPayload === 'function' ? getPayload(req) : getPayload;
    const baseUrl = resolveBaseUrl(req);
    res.json(toAbsolute(payload, baseUrl));
  } catch (error) {
    next(error);
  }
};

const parseNumberParam = (rawValue, fallback = undefined) => {
  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return fallback;
  }

  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseBooleanParam = value => {
  if (value === undefined || value === null) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some(item => parseBooleanParam(item));
  }

  const normalized = value.toString().trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'on';
};

const parseCategoriesParam = value => {
  if (value === undefined || value === null || value === '') {
    return [];
  }

  const rawCategories = Array.isArray(value) ? value : value.split(',');

  return rawCategories
    .map(item => (item ?? '').toString().trim())
    .filter(Boolean);
};

router.get('/articles', sendWithAbsolute(() => getArticles()));

router.get('/brands', sendWithAbsolute(() => getBrands()));

router.get('/collections', sendWithAbsolute(() => getCollections()));

router.get('/footer', sendWithAbsolute(() => getFooter()));

router.get('/header', sendWithAbsolute(() => getHeader()));

router.get('/hero', sendWithAbsolute(() => getHero()));

router.get('/icons', sendWithAbsolute(() => getIcons()));

router.get('/seo', sendWithAbsolute(() => getSeo()));

router.get('/goods', sendWithAbsolute(() => getGoodsOverview()));

router.get('/goods/:id', (req, res, next) => {
  try {
    const good = getGoodById(Number(req.params.id));

    if (!good) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    const baseUrl = resolveBaseUrl(req);
    res.json(toAbsolute(good, baseUrl));
  } catch (error) {
    next(error);
  }
});

router.get('/catalog/meta', (req, res, next) => {
  try {
    res.json(getGoodsFiltersMeta());
  } catch (error) {
    next(error);
  }
});

router.get('/catalog/goods', (req, res, next) => {
  try {
    const filters = {
      search: typeof req.query.search === 'string' ? req.query.search.trim() : '',
      categories: parseCategoriesParam(req.query.categories),
      minPrice: parseNumberParam(req.query.minPrice),
      maxPrice: parseNumberParam(req.query.maxPrice),
      isSale: parseBooleanParam(req.query.sale),
      isHit: parseBooleanParam(req.query.hit),
      page: parseNumberParam(req.query.page, 1),
      limit: parseNumberParam(req.query.limit, 12),
    };

    const catalog = getGoodsCatalog(filters);
    const totalPages = catalog.limit > 0 ? Math.max(1, Math.ceil(catalog.total / catalog.limit)) : 1;

    const baseUrl = resolveBaseUrl(req);
    res.json({
      items: toAbsolute(catalog.items, baseUrl),
      pagination: {
        page: catalog.page,
        limit: catalog.limit,
        total: catalog.total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/admin/check-code', (req, res) => {
  const adminCode = process.env.VITE_ADMIN_CODE?.trim();

  if (!adminCode) {
    return res
      .status(500)
      .json({ valid: false, message: 'Секретный код не настроен на сервере.' });
  }

  const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';

  if (code && code === adminCode) {
    return res.json({ valid: true });
  }

  return res
    .status(401)
    .json({ valid: false, message: 'Неверный секретный код.' });
});

router.post('/admin/goods', requireAdmin, (req, res) => {
  const good = createGood(req.body || {});

  if (!good) {
    return res.status(500).json({ message: 'Не удалось создать товар.' });
  }

  const baseUrl = resolveBaseUrl(req);
  res.status(201).json(toAbsolute(good, baseUrl));
});

router.put('/admin/goods/:id', requireAdmin, (req, res) => {
  const goodId = Number(req.params.id);
  const updatedGood = updateGood(goodId, req.body || {});

  if (!updatedGood) {
    return res.status(404).json({ message: 'Товар не найден.' });
  }

  const baseUrl = resolveBaseUrl(req);
  res.json(toAbsolute(updatedGood, baseUrl));
});

router.post('/admin/articles', requireAdmin, (req, res) => {
  const article = createArticle(req.body || {});

  if (!article) {
    return res.status(500).json({ message: 'Не удалось создать статью.' });
  }

  const baseUrl = resolveBaseUrl(req);
  res.status(201).json(toAbsolute(article, baseUrl));
});

router.put('/admin/articles/:id', requireAdmin, (req, res) => {
  const articleId = Number(req.params.id);
  const updatedArticle = updateArticle(articleId, req.body || {});

  if (!updatedArticle) {
    return res.status(404).json({ message: 'Статья не найдена.' });
  }

  const baseUrl = resolveBaseUrl(req);
  res.json(toAbsolute(updatedArticle, baseUrl));
});

router.post('/admin/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Файл не был загружен.' });
  }

  const relativePath = `/uploads/${req.file.filename}`;
  const baseUrl = resolveBaseUrl(req);
  res.status(201).json(toAbsolute({ path: relativePath }, baseUrl));
});

router.get('/server-url', (req, res) => {
  res.json({ serverUrl: resolveBaseUrl(req) });
});

module.exports = router;
