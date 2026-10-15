const express = require("express");
const cors = require("cors");
const Tiktok = require("@tobyg74/tiktok-api-dl");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    status: true,
    creator: "VINZ API",
    name: "TikTok Media Downloader API",
    message: "API aktif",
    endpoint: "/download?url=https://www.tiktok.com/@username/video/1234567890"
  });
});

app.get("/download", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({
      status: false,
      error: "Parameter url wajib diisi",
      example: "/download?url=https://www.tiktok.com/@username/video/1234567890"
    });
  }

  try {
    const parsed = new URL(url);

    const allowedHosts = [
      "tiktok.com",
      "www.tiktok.com",
      "vm.tiktok.com",
      "vt.tiktok.com",
      "m.tiktok.com"
    ];

    if (
      parsed.protocol !== "https:" ||
      !allowedHosts.includes(parsed.hostname)
    ) {
      return res.status(400).json({
        status: false,
        error: "URL TikTok tidak valid"
      });
    }

    // Fungsi downloader tetap seperti kode asli
    const response = await Tiktok.Downloader(url, {
      version: "v1"
    });

    // Ambil data video dari struktur respons API
    const data =
      response?.result?.result ||
      response?.result ||
      response;

    if (
      response?.status === false ||
      data?.status === "error"
    ) {
      return res.status(502).json({
        status: false,
        error: "Gagal mengambil video TikTok",
        message: response?.message || data?.message || "Tidak ada detail error"
      });
    }

    const author = data?.author || {};
    const stats = data?.statistics || {};
    const video = data?.video || {};
    const music = data?.music || {};

    return res.json({
      status: true,
      creator: "VINZ API",
      result: {
        type: data?.type || "video",
        id: data?.id || null,
        description: data?.desc || "",
        createTime: data?.createTime || null,

        author: {
          username: author?.username || null,
          nickname: author?.nickname || null,
          profile: author?.url || null,
          avatar: author?.avatarMedium?.[0] ||
                  author?.avatarThumb?.[0] ||
                  null
        },

        statistics: {
          views: stats?.playCount ?? 0,
          likes: stats?.likeCount ?? 0,
          comments: stats?.commentCount ?? 0,
          shares: stats?.shareCount ?? 0,
          downloads: stats?.downloadCount ?? 0
        },

        video: {
          quality: video?.ratio || null,
          duration: video?.duration ?? 0,
          cover: video?.cover?.[0] ||
                 video?.originCover?.[0] ||
                 null,
          playUrl: video?.playAddr?.[0] || null,
          downloadUrl: video?.downloadAddr?.[0] || null
        },

        music: {
          title: music?.title || null,
          author: music?.author || null,
          url: music?.playUrl?.[0] || null
        }
      }
    });
  } catch (error) {
    console.error("TikTok API error:", error.message);

    return res.status(502).json({
      status: false,
      error: "Gagal mengambil video TikTok",
      message: error.message
    });
  }
});

if (require.main === module) {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`VINZ API berjalan di port ${port}`);
  });
}

module.exports = app;
