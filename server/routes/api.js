const express = require('express');
const router = express.Router();
const { toAbsolute } = require('../utils/urlUtils');

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
  res.json(toAbsolute(goods));
});

module.exports = router;
