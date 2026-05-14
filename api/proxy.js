const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
  let target = req.query.url;

  // Eğer URL parametresi yoksa ama bir alt sayfaya gidiliyorsa
  if (!target && req.headers.referer) {
    const urlObj = new URL(req.headers.referer);
    target = urlObj.searchParams.get('url');
  }

  if (!target) {
    return res.status(400).send("Lütfen URL belirtin.");
  }

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    secure: false,
    followRedirects: true, // Yönlendirmeleri takip eder
    cookieDomainRewrite: "", // Çerezleri senin domainine uyarlar
    onProxyReq: (proxyReq, req, res) => {
      // Hedef siteye senin gerçek bilgilerini değil, kendini gönderir
      proxyReq.setHeader('User-Agent', req.headers['user-agent']);
    },
    onProxyRes: (proxyRes, req, res) => {
      // Çerezleri (Cookies) aktarır
      Object.keys(proxyRes.headers).forEach(key => {
        res.setHeader(key, proxyRes.headers[key]);
      });
    }
  });

  return proxy(req, res);
};
