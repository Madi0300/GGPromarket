const express = require('express');
const router = express.Router();
const { toAbsolute } = require('../utils/urlUtils');
const config = require('../config');

const articles = require('../data/articles');
const brands = require('../data/brands');
const collections = require('../data/collections');
const footer = require('../data/footer');
const header = require('../data/header');
const hero = require('../data/hero');
const icons = require('../data/icons');
const seo = require('../data/seo');
const goods = require('../data/goods');

router.get('/articles', (req, res) => {
  res.json(toAbsolute(articles));
});

router.get('/brands', (req, res) => {
  res.json(toAbsolute(brands));
});

router.get('/collections', (req, res) => {
  res.json(toAbsolute(collections));
});

router.get('/footer', (req, res) => {
  res.json(toAbsolute(footer));
});

router.get('/header', (req, res) => {
  res.json(toAbsolute(header));
});

router.get('/hero', (req, res) => {
  res.json(toAbsolute(hero));
});

router.get('/icons', (req, res) => {
  res.json(toAbsolute(icons));
});

router.get('/seo', (req, res) => {
  res.json(toAbsolute(seo));
});

router.get('/goods', (req, res) => {
  const goodsWithoutDescription = goods.map(item => {
    const { description, ...rest } = item;
    return rest;
  });
  res.json(toAbsolute(goodsWithoutDescription));
});

router.get('/goods/:id', (req, res) => {
  const good = goods.find(item => item.id === +req.params.id);

  if (!good) {
    return res.status(404).json({ message: 'Товар не найден' });
  }

  res.json(toAbsolute(good));
});

router.get('/server-url', (req, res) => {
  const serverUrl = `${config.host}:${config.port}`;
  res.json({ serverUrl });
});

module.exports = router;
