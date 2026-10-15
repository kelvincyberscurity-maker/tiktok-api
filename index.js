const express = require('express');
const cors = require('cors');
const TikTokApi = require('@tobyg74/tiktok-api-dl');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: true,
    name: 'TikTok Media Downloader API',
    message: 'API aktif',
    endpoint: '/download?url=LINK_TIKTOK'
  });
});

app.get('/download', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({
      status: false,
      error: 'Parameter url wajib diisi'
    });
  }

  try {
    const parsed = new URL(url);

    if (
      !['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com',
        'vt.tiktok.com', 'm.tiktok.com'].includes(parsed.hostname)
    ) {
      return res.status(400).json({
        status: false,
        error: 'URL TikTok tidak valid'
      });
    }

    const downloader =
      TikTokApi.Downloader ||
      TikTokApi.default?.Downloader;

    if (typeof downloader !== 'function') {
      return res.status(500).json({
        status: false,
        error: 'Fungsi Downloader tidak ditemukan',
        exports: Object.keys(TikTokApi)
      });
    }

    const result = await downloader(url, {
      version: 'v1'
    });

    return res.json({
      status: true,
      result
    });
  } catch (error) {
    console.error('TikTok API error:', error);

    return res.status(502).json({
      status: false,
      error: 'Gagal mengambil video TikTok',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API berjalan di port ${PORT}`);
  });
}

module.exports = app;
