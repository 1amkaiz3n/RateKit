# RateKit - Freelancer Pricing Calculator

Aplikasi web modern untuk membantu freelancer menghitung tarif dan harga proyek secara profesional.

## Fitur

- ✅ Menghitung tarif dasar per jam berdasarkan biaya hidup dan operasional
- ✅ Menghitung harga proyek dengan estimasi waktu dan biaya tambahan
- ✅ Manajemen biaya operasional yang dapat dikustomisasi
- ✅ Dashboard real-time dengan ringkasan kebutuhan
- ✅ Penyimpanan data otomatis dalam file JSON
- ✅ Dark mode & Light mode
- ✅ Chart visualisasi untuk persentase biaya
- ✅ Riwayat estimasi proyek

## Cara Menggunakan

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Jalankan Aplikasi

```bash
cd RateKit
python3 main.py
```

Atau:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Buka Browser

Akses: http://localhost:8000

## Struktur Data

Data disimpan dalam folder `data/`:

- `settings.json` - Pengaturan target gaji, hari kerja, jam produktif, margin
- `expenses.json` - Daftar biaya operasional
- `projects.json` - Riwayat estimasi proyek

## Filosofi

Aplikasi ini tidak menggunakan database apapun. Semua data disimpan dalam file JSON di folder `data/` sehingga sangat mudah untuk di-backup, di-restore, atau dipindahkan ke komputer lain.
