const express = require('express');
const router = express.Router();
const { toAbsolute, resolveBaseUrl } = require('../utils/urlUtils');

const articles = require('../data/articles');
const brands = require('../data/brands');
const collections = require('../data/collections');
const footer = require('../data/footer');
const header = require('../data/header');
const hero = require('../data/hero');
const icons = require('../data/icons');
const seo = require('../data/seo');
const goods = require('../data/goods');

const sendWithAbsolute = payload => (req, res) => {
  const baseUrl = resolveBaseUrl(req);
  res.json(toAbsolute(payload, baseUrl));
};

router.get('/articles', sendWithAbsolute(articles));

router.get('/brands', sendWithAbsolute(brands));

router.get('/collections', sendWithAbsolute(collections));

router.get('/footer', sendWithAbsolute(footer));

router.get('/header', sendWithAbsolute(header));

router.get('/hero', sendWithAbsolute(hero));

router.get('/icons', sendWithAbsolute(icons));

router.get('/seo', sendWithAbsolute(seo));

router.get('/goods', (req, res) => {
  const goodsWithoutDescription = goods.map(item => {
    const { description, ...rest } = item;
    return rest;
  });
  const baseUrl = resolveBaseUrl(req);
  res.json(toAbsolute(goodsWithoutDescription, baseUrl));
});

router.get('/goods/:id', (req, res) => {
  const good = goods.find(item => item.id === +req.params.id);

  if (!good) {
    return res.status(404).json({ message: 'Товар не найден' });
  }

  const baseUrl = resolveBaseUrl(req);
  res.json(toAbsolute(good, baseUrl));
});

router.get('/server-url', (req, res) => {
  res.json({ serverUrl: resolveBaseUrl(req) });
});

module.exports = router;
