const express = require('express');
const router = express.Router();

const articles = require('../data/articles');
const brands = require('../data/brands');
const collections = require('../data/collections');
const footer = require('../data/footer');
const header = require('../data/header');
const hero = require('../data/hero');
const icons = require('../data/icons');
const seo = require('../data/seo');

router.get('/articles', (req, res) => {
  res.json(articles);
});

router.get('/brands', (req, res) => {
  res.json(brands);
});

router.get('/collections', (req, res) => {
  res.json(collections);
});

router.get('/footer', (req, res) => {
  res.json(footer);
});

router.get('/header', (req, res) => {
  res.json(header);
});

router.get('/hero', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const toAbsolute = (url) => {
    if (!url) return url;
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `${baseUrl}${url}`;
  };

  const response = {
    ...hero,
    heroItems: hero.heroItems.map((item) => ({
      ...item,
      imgUrl: toAbsolute(item.imgUrl),
    })),
    heroSidebarItems: hero.heroSidebarItems.map((item) => ({
      ...item,
      imgUrl: toAbsolute(item.imgUrl),
    })),
  };

  res.json(response);
});

router.get('/icons', (req, res) => {
  res.json(icons);
});

router.get('/seo', (req, res) => {
  res.json(seo);
});

module.exports = router;
