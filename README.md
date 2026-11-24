# TOK DALANG STORE — Cloudflare Pages

Website toko digital responsif dengan katalog publik, pemesanan WhatsApp, serta admin untuk tambah/edit/hapus produk. Backend menggunakan Cloudflare Pages Functions dan Cloudflare D1.

## 1. Siapkan database D1

1. Masuk ke https://dash.cloudflare.com/
2. Buka **Workers & Pages → D1 SQL Database → Create database**.
3. Nama database: `tok-dalang-store-db`.
4. Buka database → **Console**.
5. Salin isi file `schema.sql`, jalankan di console.
6. Salin **Database ID** dari halaman database.

## 2. Hubungkan project ke Cloudflare Pages

Cara yang disarankan:
1. Upload folder project ini ke repository GitHub.
2. Di Cloudflare Dashboard buka **Workers & Pages → Create → Pages → Connect to Git**.
3. Pilih repository tersebut.
4. Framework preset: **None**.
5. Build command: kosongkan.
6. Build output directory: `public`.
7. Deploy.

Folder `functions/api` harus berada di root repository, sejajar dengan `public`, agar Cloudflare Pages Functions aktif.

## 3. Hubungkan D1 ke Pages

Di project Pages:
1. Buka **Settings → Functions → D1 database bindings**.
2. Add binding:
   - Variable name: `DB`
   - D1 database: `tok-dalang-store-db`
3. Save dan redeploy.

## 4. Atur rahasia admin

Di Pages project buka **Settings → Variables and Secrets → Add** (Production):
- `ADMIN_PASSWORD` = buat password admin yang kuat.
- `TOKEN_SECRET` = string rahasia acak panjang minimal 32 karakter.

Contoh membuat TOKEN_SECRET di PowerShell:
```powershell
-join ((1..48) | ForEach-Object { "{0:X2}" -f (Get-Random -Maximum 256) })
```
Jangan gunakan contoh password publik. Setelah menambahkan secret, lakukan redeploy.

## 5. Atur nomor WhatsApp toko

Buka `public/index.html`, cari baris:
```js
const CONFIG={whatsapp:"6281234567890",storeName:"TOK DALANG STORE"};
```
Ganti nomor dengan nomor WhatsApp admin dalam format internasional tanpa `+`, spasi, atau strip. Contoh Indonesia: `62812xxxxxxx`. Commit perubahan ke GitHub agar Pages deploy ulang.

## 6. Hubungkan domain

Di Cloudflare Pages:
1. Buka project → **Custom domains → Set up a custom domain**.
2. Masukkan domain yang sudah kamu miliki, misalnya `tokdalangstore.com`.
3. Ikuti instruksi DNS yang muncul.
4. Pastikan domain sudah aktif di Cloudflare DNS. HTTPS akan disiapkan otomatis setelah DNS terverifikasi.

## 7. Kelola produk

Buka website → klik tombol **Admin** → masukkan `ADMIN_PASSWORD`.
Admin bisa menambah, mengubah, dan menghapus produk. Gambar produk menggunakan URL gambar publik (misalnya URL gambar dari layanan penyimpanan gambar). Katalog publik membaca data dari D1.

## Catatan penting

- Harga contoh dan nomor WhatsApp pada project ini adalah placeholder. Ubah sebelum website dipublikasikan.
- Jangan pernah menaruh password admin atau `TOKEN_SECRET` di file HTML, GitHub, atau kode JavaScript. Simpan hanya di Cloudflare Secrets.
- Tombol pemesanan membuka WhatsApp; pembayaran online otomatis belum diintegrasikan.
- Backup database D1 secara berkala.
