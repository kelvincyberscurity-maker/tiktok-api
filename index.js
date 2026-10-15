const express = require("express");
const cors = require("cors");
const Tiktok = require("@tobyg74/tiktok-api-dl");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    status: true,
    name: "TikTok Media Downloader API",
    message: "API aktif",
    example: "/download?url=https://www.tiktok.com/@username/video/1234567890"
  });
});

app.get("/download", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({
      status: false,
      error: "Parameter url wajib diisi"
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

    const result = await Tiktok.Downloader(url, {
      version: "v1"
    });

    return res.json({
      status: true,
      result
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
    console.log(`API berjalan di port ${port}`);
  });
}

module.exports = app;
