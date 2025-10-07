const config = require('../config');

function toAbsolute(data) {
  const baseUrl = `${config.host}:${config.port}`;

  if (Array.isArray(data)) {
    return data.map(item => toAbsolute(item));
  }

  if (typeof data === 'object' && data !== null) {
    const newData = {};
    for (const key in data) {
      const value = data[key];
      if (typeof value === 'string' && value.startsWith('/images')) {
        newData[key] = `${baseUrl}${value}`;
      } else {
        newData[key] = toAbsolute(value);
      }
    }
    return newData;
  }

  return data;
}

module.exports = { toAbsolute };
