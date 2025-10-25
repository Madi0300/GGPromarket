const config = require('../config');

const getFallbackBaseUrl = () => {
  if (config?.baseUrl) {
    return config.baseUrl;
  }

  if (config?.host) {
    const normalizedHost = config.host.replace(/\/+$/, '');

    if (config.port) {
      const hasExplicitPort = /:[0-9]+$/.test(normalizedHost);
      return hasExplicitPort ? normalizedHost : `${normalizedHost}:${config.port}`;
    }

    return normalizedHost;
  }

  return '';
};

const resolveBaseUrl = req => {
  if (req) {
    const forwardedProto = req.headers['x-forwarded-proto'];
    const forwardedHost = req.headers['x-forwarded-host'];

    const protocol = (forwardedProto ? forwardedProto.split(',')[0] : req.protocol) || 'http';
    const host = (forwardedHost ? forwardedHost.split(',')[0] : req.get('host')) || '';

    if (host) {
      return `${protocol}://${host}`;
    }
  }

  return getFallbackBaseUrl();
};

const ASSET_EXTENSION_REGEXP = /\.(png|jpe?g|svg|webp|gif|bmp|ico|avif)$/i;
const ensureTrailingSlash = value => (value.endsWith('/') ? value : `${value}/`);
const stripQueryAndHash = value => value.split(/[?#]/)[0];
const hasScheme = value => /^[a-z][a-z0-9+\-.]*:/i.test(value);

const isRelativeAssetPath = value => {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  if (trimmed.startsWith('//') || hasScheme(trimmed)) {
    return false;
  }

  return ASSET_EXTENSION_REGEXP.test(stripQueryAndHash(trimmed));
};

const makeAbsoluteUrl = (value, baseUrl) => {
  try {
    return new URL(value, ensureTrailingSlash(baseUrl)).toString();
  } catch (error) {
    if (value.startsWith('/')) {
      return `${baseUrl}${value}`;
    }

    return `${ensureTrailingSlash(baseUrl)}${value}`;
  }
};

const toAbsolute = (data, baseUrl = resolveBaseUrl()) => {
  if (!baseUrl) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => toAbsolute(item, baseUrl));
  }

  if (typeof data === 'object' && data !== null) {
    const newData = {};

    for (const key in data) {
      const value = data[key];

      if (typeof value === 'string') {
        newData[key] = isRelativeAssetPath(value) ? makeAbsoluteUrl(value, baseUrl) : value;
      } else {
        newData[key] = toAbsolute(value, baseUrl);
      }
    }

    return newData;
  }

  return data;
};

module.exports = { toAbsolute, resolveBaseUrl };
