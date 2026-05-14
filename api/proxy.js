const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
  const target = req.query.url;

  if (!target) {
    return res.status(400).send("Kullanım: /git?url=https://hedef-site.com");
  }

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    // Hedef siteye giderken path'i temizler
    pathRewrite: (path, req) => {
        return '';
    },
    // Hata oluşursa (site kapalıysa vb.) yakalar
    onError: (err, req, res) => {
      res.status(500).send("Proxy Hatası: " + err.message);
    }
  });

  return proxy(req, res);
};