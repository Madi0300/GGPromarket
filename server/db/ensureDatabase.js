const db = require('./database');
const seedDatabase = require('./seed');

const hasTable = tableName =>
  db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?")
    .get(tableName);

const ensureDatabase = () => {
  const articlesTable = hasTable('articles');
  if (!articlesTable) {
    seedDatabase();
    return;
  }

  const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles').get();
  if (!articleCount || !articleCount.count) {
    seedDatabase();
  }
};

module.exports = ensureDatabase;
