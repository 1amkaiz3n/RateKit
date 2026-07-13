# RateKit - Freelancer Pricing Calculator

Aplikasi web untuk membantu freelancer menghitung tarif per jam dan menentukan harga proyek dengan akurat.

Dibuat karena satu masalah klasik: **"Bang, bikin bot berapa?"** — dan kita bengong sambil menghitung nasib finansial seperti manusia purba menghitung batu. 😄

---

## Cara Kerja

### 1. Hitung Tarif per Jam

Pertama, kamu tentukan target penghasilan dan produktivitas:

| Variabel | Contoh |
|---|---|
| Target Gaji per Bulan | Rp5.000.000 |
| Biaya Operasional per Bulan | Rp2.265.000 |
| Total Kebutuhan Bulanan | **Rp7.265.000** |
| Hari Kerja per Bulan | 22 hari |
| Jam Produktif per Hari | 6 jam |
| Jam Produktif per Bulan | **132 jam** |

**Rumus:**
```
Tarif Dasar per Jam = Total Kebutuhan Bulanan ÷ Jam Produktif Bulanan
                    = Rp7.265.000 ÷ 132
                    = Rp55.000/jam
```

### 2. Tambahkan Target Keuntungan

Kamu bisa menentukan Target Keuntungan (misalnya 30%) berdasarkan level skill atau posisi pasar.

**Rumus:**
```
Tarif Jual per Jam = Tarif Dasar × (1 + Target Keuntungan / 100)
                   = Rp55.000 × (1 + 30/100)
                   = Rp71.500/jam
```

### 3. Hitung Harga Proyek

Estimasi total jam pengerjaan (bisa input dalam Jam, Hari, Minggu, atau Bulan — sistem akan otomatis konversi ke jam).

**Rumus:**
```
Harga Total = Tarif Jual × Estimasi Jam + Biaya Tambahan
```

### 4. Market Positioning

Setelah mendapat Harga Total, RateKit menampilkan tiga opsi harga:

| Posisi | Rumus | Contoh |
|---|---|---|
| **Minimum** | = Harga Total (dibulatkan ke Rp50.000 terdekat) | Rp300.000 |
| **Ideal** | = Harga Total (dibulatkan ke Rp50.000 terdekat) | Rp300.000 |
| **Premium** | = Harga Total × 1.3 (dibulatkan ke Rp50.000 terdekat) | Rp350.000 |

> Minimum dibuat sama dengan Total Harga agar kamu tidak menjual di bawah biaya produksi.

---

## Fitur

- **Dashboard** — Ringkasan target gaji, biaya operasional, tarif dasar, dan tarif jual
- **Biaya Operasional** — Kelola daftar pengeluaran bulanan
- **Pengaturan** — Atur target gaji, hari kerja, jam produktif, target keuntungan
- **Estimasi Proyek** — Hitung harga proyek dengan estimasi selesai (Jam/Hari/Minggu/Bulan) + Market Positioning
- **Riwayat** — Simpan dan kelola riwayat estimasi proyek

---

## Cara Menggunakan

### 1. Clone Repository

```bash
git clone https://github.com/1amkaiz3n/RateKit.git
cd RateKit
```

### 2. Buat Virtual Environment

```bash
python3 -m venv myenv
```

### 3. Aktifkan Virtual Environment

**Linux / macOS**
```bash
source myenv/bin/activate
```

**Windows (CMD)**
```cmd
myenv\Scripts\activate.bat
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Jalankan Aplikasi

```bash
python3 run.py
```

Atau langsung dengan Uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 6. Buka Aplikasi

Buka browser dan akses:
```
http://localhost:8000
```

---

## Struktur Data

Semua data disimpan dalam folder `data/` dalam format JSON:

- `settings.json` — Pengaturan target gaji, hari kerja, jam produktif, target keuntungan
- `expenses.json` — Daftar biaya operasional
- `projects.json` — Riwayat estimasi proyek (termasuk harga minimum, ideal, premium)

> Tidak menggunakan database. Semua data disimpan dalam file JSON — mudah di-backup, di-restore, atau dipindahkan.

---

## Rumus Lengkap

```
Tarif Dasar      = (Target Gaji + Total Biaya Operasional) ÷ (Hari Kerja × Jam Produktif)
Tarif Jual       = Tarif Dasar × (1 + Target Keuntungan / 100)
Harga Total      = Tarif Jual × Estimasi Jam + Biaya Tambahan
Minimum          = roundUpKe50rb(Harga Total)
Ideal            = roundUpKe50rb(Harga Total)
Premium          = roundUpKe50rb(Harga Total × 1.3)
```

---

> Rumus ini saya buat sendiri berdasarkan kebutuhan daily freelance. Bukan hasil ChatGPT. 😄
> Setidaknya membantu saya sendiri — dan semoga membantu kamu juga.
