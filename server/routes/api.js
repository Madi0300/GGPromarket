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
