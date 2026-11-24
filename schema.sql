CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Lainnya',
  price INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, category, price, description, image) VALUES
('Jasa Setup Discord', 'Discord', 50000, 'Setup server Discord dengan channel, role, permission, dan tampilan yang rapi.', ''),
('Jasa Mapping SA-MP', 'SA-MP', 75000, 'Pembuatan atau penyesuaian mapping untuk server SA-MP.', ''),
('Pembuatan Website', 'Website', 100000, 'Website profil atau landing page untuk kebutuhan komunitas dan bisnis.', ''),
('Desain Logo & Banner', 'Desain', 35000, 'Desain identitas visual untuk server game, komunitas, atau toko.', ''),
('Jasa Pasang Bot Discord', 'Discord', 25000, 'Bantuan pemasangan dan konfigurasi bot Discord.', ''),
('Optimasi Server Game', 'Gaming', 50000, 'Bantuan konfigurasi dasar dan optimasi server game.', '');