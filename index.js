const express = require('express');
const cors = require('cors');
const { downloadVideo } = require('tiktok-api-downloader');

const app = express();
app.use(cors());

app.get('/', (_req, res) => {
  res.status(200).json({
    status: true,
    name: 'TikTok Media Downloader API',
    message: 'API aktif. Gunakan endpoint /download?url=LINK_TIKTOK',
    example: '/download?url=https://www.tiktok.com/@username/video/1234567890'
  });
});

app.get('/download', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ status: false, error: 'Parameter url wajib diisi', example: '/download?url=https://www.tiktok.com/@username/video/1234567890' });
  }
  try {
    const parsed = new URL(url);
    if (!['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com', 'm.tiktok.com'].includes(parsed.hostname)) {
      return res.status(400).json({ status: false, error: 'URL harus berupa tautan TikTok yang valid' });
    }
    const response = await downloadVideo(url);
    return res.status(200).json(response);
  } catch (error) {
    console.error('TikTok download error:', error);
    return res.status(500).json({ status: false, error: 'Gagal memproses video TikTok. Coba tautan lain atau coba lagi nanti.' });
  }
});

// Vercel memakai export app; npm start tetap bisa dipakai untuk lokal.
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
