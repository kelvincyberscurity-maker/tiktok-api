const express = require('express');
const cors = require('cors');
const { downloadVideo } = require('@tobyg74/tiktok-api-dl');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    status: true,
    name: 'TikTok Media Downloader API',
    message: 'API aktif. Gunakan endpoint /download?url=LINK_TIKTOK',
    example: '/download?url=https://www.tiktok.com/@username/video/123456789'
  });
});

app.get('/download', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({
      status: false,
      error: 'Parameter url wajib diisi',
      example: '/download?url=https://www.tiktok.com/@username/video/123456789'
    });
  }

  try {
    const parsed = new URL(url);
    const allowedHosts = [
      'tiktok.com',
      'www.tiktok.com',
      'vm.tiktok.com',
      'vt.tiktok.com',
      'm.tiktok.com'
    ];

    if (
      parsed.protocol !== 'https:' ||
      !allowedHosts.includes(parsed.hostname)
    ) {
      return res.status(400).json({
        status: false,
        error: 'Gunakan URL HTTPS TikTok yang valid'
      });
    }

    const raw = await downloadVideo(url);
    const data = raw?.result?.result ?? raw?.result ?? raw;

    if (!data || typeof data !== 'object') {
      throw new Error('Format respons downloader tidak valid');
    }

    const author = data.author || {};
    const stats = data.statistics || {};
    const video = data.video || {};
    const music = data.music || {};

    const result = {
      type: data.type || 'video',
      id: data.id || null,
      description: data.desc || '',
      createTime: data.createTime || null,

      author: {
        username: author.username || author.uniqueId || null,
        nickname: author.nickname || null,
        avatar: author.avatarMedium?.[0]
          || author.avatarThumb?.[0]
          || null,
        profileUrl: author.url || null
      },

      statistics: {
        playCount: stats.playCount ?? 0,
        likeCount: stats.likeCount ?? 0,
        commentCount: stats.commentCount ?? 0,
        shareCount: stats.shareCount ?? 0,
        downloadCount: stats.downloadCount ?? 0
      },

      video: {
        duration: video.duration ?? null,
        ratio: video.ratio ?? null,
        thumbnail: video.cover?.[0]
          || video.originCover?.[0]
          || null,
        downloadUrl: video.playAddr?.[0]
          || video.downloadAddr?.[0]
          || null
      },

      music: {
        title: music.title || null,
        author: music.author || null,
        url: music.playUrl?.[0] || null
      }
    };

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

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`TikTok API berjalan di port ${PORT}`);
  });
}

module.exports = app;
