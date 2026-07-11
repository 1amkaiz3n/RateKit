# RateKit - Freelancer Pricing Calculator

Tools web untuk membantu freelancer menghitung tarif dan harga proyek.

Di dasari dengan pertanyaan,**berapa ya harga yang harus saya tentukan untuk project ini??**

Saya membuat rumus seperti ini :

1. Tentukan Target gaji/bulan
2. Tentukan biaya operasional
3. Tentukan berapa hari kerja/bulan
4. Tentukan jam kerja/hari
5. Posisikan diri sebagai apa (pemula,junior,senior,expert)

Contoh :

1. Target gaji/bulan : 5 juta
2. Biaya Operasional/bulan :
  - Makan = `900` ribu
  - Rokok = `900` ribu
  - Wifi = `165` ribu
  - Listrik = `300` ribu
  - **Total** = `2.265.000`
3. Dalam sebulan kerja senin-jumat berarti total `22` hari dalam sebulan
4. Dalam sehari,kerja 6 jam,berarti dalam sebulan `132` jam
5. Posisikan diri sebagai **Senior**

**Rumus yang saya pakai :**

- Target gaji + Biaya operasional 

  - `5.000.000` + `2.265.000` = `7.265.000`

  - Total kebutuhan/bulan = `7.265.000`

- Total Kebutuhan/bulan ÷ jam kerja

  - `7.265.000` ÷ `132` = `55.000`

Jadi Tarif dasar nya adalah `Rp.55.000/jam`

Posisikan diri ini menentukan margin kita,misalkan kita bisa mengatur margin `30%` karena saya posisian diri sebagai senior,sebenarnya ini bebas aja sih mau menentukan berapa persen juga,**tergantung berapa kita mau menghargai skill kita**


Jadi,
Tarif dasar x margin

`55.000` x `30%` = `16.5000`

`55.000 `+ `16.500` = `71.500`

**Penjelasan :**

  - `Rp55.000/jam` → **Tarif dasar** (**cost rate**). Ini adalah biaya minimum agar target gaji dan biaya operasional terpenuhi.
  - `Rp71.500/jam` → **Tarif jual** (**billable rate**). Ini adalah harga yang kita tagihkan ke klien setelah ditambah margin.


**Estimsi Project :**

Misakln ada project **Bot Broadcast Telegram**,estimasi selesai nya 3 jam,berarti :

`71.500 ` x `3` = `214.500`

> Estimasi pengerjaan harus mempertimbangkan waktu coding, testing, revisi, deployment, dan komunikasi dengan klien. Jangan hanya menghitung waktu menulis kode.


Berarti kta bisa menawarkan harga project tersebut degan harga `214.500`,atu bbisa di bulatkan menjadi `250.000`,,atau mau 500 ribu juga boleh sih.



> Rumus saya buat sendiri bukan hasil ChatGPT,makanya pusing.Gak tau **Margin**/**Markup**.
> 😄 Setidaknya bisa membantu saya sendiri.


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

**Windows (PowerShell)**

```powershell
myenv\Scripts\Activate.ps1
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Jalankan Aplikasi

Menggunakan Python:

```bash
python3 main.py
```

Atau menggunakan Uvicorn (direkomendasikan saat development):

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 6. Buka Aplikasi

Buka browser dan akses:

```
http://localhost:8000
```


## Struktur Data

Data disimpan dalam folder `data/`:

- `settings.json` - Pengaturan target gaji, hari kerja, jam produktif, margin
- `expenses.json` - Daftar biaya operasional
- `projects.json` - Riwayat estimasi proyek


>Aplikasi ini tidak menggunakan database apapun. Semua data disimpan dalam file JSON di folder `data/` sehingga sangat mudah untuk di-backup, di-restore, atau dipindahkan ke komputer lain.
