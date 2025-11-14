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

router.get('/server-url', (req, res) => {
  res.json({ serverUrl: resolveBaseUrl(req) });
});

module.exports = router;
