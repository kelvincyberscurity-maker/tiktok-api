# TikTok Media Downloader API (Vercel-ready)

## Deploy ke Vercel
1. Ekstrak ZIP ini.
2. Upload isi folder `tiktokAPI-vercel` ke repository GitHub (jangan upload ZIP sebagai satu file).
3. Di Vercel pilih Add New → Project → Import repository tersebut.
4. Framework Preset: Other. Build Command dan Output Directory boleh dikosongkan. Deploy.
5. Tes `https://NAMA-PROJECT.vercel.app/` lalu `https://NAMA-PROJECT.vercel.app/download?url=LINK_TIKTOK`.

## Jalankan lokal
Node.js 18+ direkomendasikan.
```bash
npm install
npm start
```
Lalu buka http://localhost:4000/.

Catatan: endpoint mengembalikan metadata dan URL media jika layanan TikTok dan dependency masih berfungsi. Ketersediaan dapat berubah karena perubahan TikTok atau batasan platform.
