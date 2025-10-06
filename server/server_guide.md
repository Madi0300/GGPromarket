# Server Guide

Этот файл содержит руководство по работе с бэкенд сервером.

## Запуск сервера

Для запуска сервера выполните следующую команду в корневой директории проекта:

```bash
cd server
node server.js
```

Сервер будет запущен по адресу `http://localhost:3001`.

## Структура проекта

- `server.js`: Основной файл сервера.
- `data/`: Папка с модулями данных.
- `routes/`: Папка с маршрутами API.
- `public/`: Папка со статическими файлами (изображениями).

## API Endpoints

Сервер предоставляет следующие эндпоинты для получения данных:

- `GET /api/articles`: Получение списка статей.
- `GET /api/brands`: Получение списка брендов.
- `GET /api/collections`: Получение данных о коллекциях.
- `GET /api/footer`: Получение данных для футера.
- `GET /api/header`: Получение данных для хедера.
- `GET /api/hero`: Получение данных для слайдера Hero.
- `GET /api/icons`: Получение данных для блока с иконками.
- `GET /api/seo`: Получение данных для SEO блока.
- `GET /api/goods`: Получение списка товаров.

## Добавление изображений

Все изображения доступны по пути `/images/...`. Например, `http://localhost:3001/images/hero/1/image.png`.

### Индексированные изображения (Articles, Hero)

Для таких секций, как `articles` и `hero`, изображения хранятся в папках с числовыми индексами.
Чтобы добавить новое изображение для статьи, создайте новую папку в `server/public/images/articles/` с соответствующим номером (например, `9`) и положите в нее файл `image.png`.

### Изображения товаров (Goods)

Для товаров изображения хранятся в папках с числовыми индексами.
Чтобы добавить новое изображение для товара, создайте новую папку в `server/public/images/goods/` с соответствующим номером (например, `31`) и положите в нее файл `image.png`.

### Изображения брендов

Изображения для брендов находятся в `server/public/images/brands/`. Для добавления нового бренда, создайте папку с названием бренда (например, `new-brand`) и поместите в нее изображение `image.svg`.

### Остальные изображения

- **Коллекции**: `server/public/images/collections/`
- **Футер**: `server/public/images/footer/`
- **SEO**: `server/public/images/seo/`

## Структура данных

Ниже представлена структура данных, возвращаемая каждым эндпоинтом.

### `/api/articles`

```json
[
  {
    "id": 1,
    "title": "...",
    "imgUrl": "/images/articles/1/image.png",
    "link": "/articles/1"
  }
]
```

### `/api/brands`

```json
[
  {
    "name": "Hansgrohe",
    "imgUrl": "/images/brands/hansgrohe/image.svg",
    "link": "/brands/hansgrohe"
  }
]
```

### `/api/collections`

```json
{
  "main": {
    "title": "Сияние",
    "autor": "Kerama Marazzi",
    "imgSrc": "/images/collections/main.png"
  },
  "second": { ... }
}
```

### `/api/footer`

```json
{
  "productLinks": [{ "name": "...", "href": "..." }],
  "infoLinks": [{ "name": "...", "href": "..." }],
  "socialMediaLinks": [{ "name": "...", "href": "...", "img": "..." }],
  "adress": "...",
  "email": "...",
  "rate": { "href": "...", "imgUrl": "...", "alt": "..." }
}
```

### `/api/header`

```json
{
  "currentLocation": "Москва",
  "callNumber": 84950183210,
  "productCatalog": [{ "name": "...", "href": "..." }],
  "notificationSum": { "user": 0, "liked": 3, "cart": 2 }
}
```

### `/api/hero`

```json
{
  "heroItems": [
    {
      "id": 1,
      "title": "...",
      "subtitle": "...",
      "link": "...",
      "imgUrl": "/images/hero/1/image.png"
    }
  ],
  "heroSidebarItems": [
    {
      "title": "...",
      "link": "...",
      "imgUrl": "/images/hero/sidebar/1.png"
    }
  ]
}
```

### `/api/icons`

```json
[
  {
    "key": "truck",
    "icon": "/Icons/truck.svg",
    "text": "..."
  }
]
```

### `/api/seo`

```json
{
  "title": "...",
  "text": "...",
  "imgUrl": "/images/seo/seo.png"
}
```

### `/api/goods`

```json
[
  {
    "name": "Раковина Roca Debba 32799400Y, 60x48 см",
    "href": "#",
    "country": "Испания",
    "price": 2601,
    "discount": null,
    "imgUrl": "/images/goods/1/image.png",
    "rate": 4.5,
    "commentsSum": 12,
    "isHit": true,
    "category": "Sinks"
  }
]
```
