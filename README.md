# Bank Sampah Teratai Web Application

<div align="center">

![Bank Sampah Teratai](https://img.shields.io/badge/Version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.1.11-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-11.1.0-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

**Sistem Manajemen Bank Sampah Digital**

Aplikasi web modern untuk mengelola operasional Bank Sampah Teratai, memudahkan pencatatan transaksi sampah, manajemen nasabah, dan pelaporan.

[Demo](#) • [Dokumentasi](#) • [Laporan Bug](#)

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Proyek](#-struktur-proyek)
- [Deployment](#-deployment)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🌟 Tentang Proyek

**Bank Sampah Teratai Web Application** adalah sistem manajemen digital yang dirancang khusus untuk memudahkan operasional bank sampah. Aplikasi ini menyediakan solusi lengkap mulai dari pencatatan transaksi, manajemen nasabah, pengelolaan stok sampah, hingga pelaporan keuangan.

### Tujuan

- Digitalisasi proses pencatatan transaksi bank sampah
- Meningkatkan transparansi dan akuntabilitas operasional
- Memudahkan monitoring stok dan harga sampah
- Menyediakan dashboard informatif untuk pengambilan keputusan
- Meningkatkan efisiensi administrasi bank sampah

---

## ✨ Fitur Utama

### 🔐 Autentikasi & Otorisasi
- Login aman dengan Firebase Authentication
- Middleware untuk proteksi route yang memerlukan autentikasi
- Session management yang aman

### 👥 Manajemen Nasabah
- Pendaftaran nasabah baru
- Pencarian dan filtering nasabah
- Detail profil dan riwayat transaksi nasabah
- Pagination untuk performa optimal

### 💰 Manajemen Transaksi
- **Transaksi Nasabah**: Pencatatan penyetoran sampah dari nasabah
- **Transaksi Pihak Ketiga**: Pencatatan penjualan sampah ke pihak ketiga
- Detail transaksi lengkap dengan item dan total
- Fitur print dan share transaksi
- Riwayat transaksi dengan filter dan pencarian

### 📦 Manajemen Stok
- Monitoring stok real-time untuk setiap jenis sampah
- Update stok otomatis berdasarkan transaksi
- Riwayat perubahan stok
- Alert untuk stok minimum

### 💵 Manajemen Harga
- Update harga jenis sampah
- Riwayat perubahan harga
- Halaman publik untuk cek harga sampah terkini

### 📊 Dashboard & Laporan
- Dashboard dengan statistik dan metrik penting
- Ringkasan harian transaksi
- Grafik dan visualisasi data
- Export laporan (PDF)

### 🌐 Halaman Publik
- Halaman home dengan informasi bank sampah
- Tentang kami
- Kegiatan bank sampah
- Update harga sampah real-time

### 🖼️ Upload Gambar
- Integrasi dengan Cloudinary untuk upload dan manajemen gambar
- Optimasi gambar otomatis

---

## 🛠️ Teknologi

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework dengan App Router
- **[React 19](https://react.dev/)** - Library UI
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
- **[Lucide React](https://lucide.dev/)** - Icon library

### Backend & Database
- **[Firebase](https://firebase.google.com/)**
  - Firebase Authentication - User authentication
  - Cloud Firestore - NoSQL database
  - Real-time data synchronization

### Services & Libraries
- **[next-cloudinary](https://next.cloudinary.dev/)** - Image upload dan management
- **[jsPDF](https://github.com/parallax/jsPDF)** - PDF generation
- **[jsPDF AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)** - Table generation untuk PDF

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 📋 Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** versi 18.x atau lebih tinggi
- **npm** atau **yarn** atau **pnpm**
- **Firebase Project** dengan Firestore dan Authentication enabled
- **Cloudinary Account** (opsional, untuk upload gambar)
- **Git** untuk version control

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/username/bank-sampah-teratai-web.git
cd bank-sampah-teratai-web
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

---

## ⚙️ Konfigurasi

### 1. Environment Variables

Buat file `.env.local` di root directory dan tambahkan konfigurasi berikut:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Cloudinary Configuration (Optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Firebase Setup

1. Buat project baru di [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** dengan Email/Password provider
3. Enable **Cloud Firestore** database
4. Buat Firestore collections:
   - `nasabah` - Data nasabah
   - `transaksiNasabah` - Transaksi dari nasabah
   - `transaksiBST` - Transaksi ke pihak ketiga
   - `jenisSampah` - Data jenis sampah dan harga
   - `dailySummary` - Ringkasan harian
   - `counter` - Counter untuk ID otomatis

5. Copy konfigurasi Firebase ke `.env.local`

### 3. Cloudinary Setup (Opsional)

1. Daftar di [Cloudinary](https://cloudinary.com/)
2. Dapatkan Cloud Name, API Key, dan API Secret dari dashboard
3. Tambahkan ke `.env.local`

---

## 🏃‍♂️ Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Production Build

```bash
# Build aplikasi
npm run build

# Jalankan production server
npm start
```

### Linting

```bash
npm run lint
```

---

## 📁 Struktur Proyek

```
bank-sampah-teratai-web/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group untuk autentikasi
│   │   ├── login/               # Halaman login
│   │   └── register/            # Halaman register (disabled)
│   ├── dashboard/               # Dashboard admin
│   │   ├── nasabah/            # Manajemen nasabah
│   │   ├── transaksi/          # Transaksi nasabah
│   │   ├── pihak-ketiga/       # Transaksi pihak ketiga
│   │   ├── stok/               # Manajemen stok
│   │   ├── pembeli/            # Data pembeli
│   │   └── pengaturan/         # Pengaturan (harga, dll)
│   ├── kegiatan/               # Halaman publik kegiatan
│   ├── tentang-kami/           # Halaman publik tentang
│   ├── update-harga/           # Halaman publik cek harga
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
├── components/                  # Reusable components
│   ├── ui/                     # UI components (Radix UI wrappers)
│   ├── Header.tsx              # Header component
│   └── ...
├── context/                     # React Context
│   └── AppContext.tsx          # Global app state
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts             # Authentication hook
│   └── useToast.ts            # Toast notification hook
├── lib/                         # Libraries and services
│   ├── firebase.js            # Firebase initialization
│   ├── NasabahService.ts      # Nasabah service layer
│   ├── TransaksiNasabahService.ts
│   ├── TransaksiBSTService.ts
│   ├── JenisSampahService.ts
│   ├── CounterService.ts
│   ├── DailySummaryService.ts
│   └── utils.ts               # Utility functions
├── public/                      # Static assets
├── .env.local                  # Environment variables (not in git)
├── .gitignore                  # Git ignore rules
├── middleware.ts               # Next.js middleware (auth protection)
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push code ke GitHub/GitLab/Bitbucket
2. Import project di [Vercel](https://vercel.com)
3. Tambahkan environment variables di Vercel dashboard
4. Deploy!

```bash
# Atau gunakan Vercel CLI
npm i -g vercel
vercel
```

### Environment Variables di Vercel

Pastikan menambahkan semua environment variables dari `.env.local` ke **Vercel Project Settings → Environment Variables**

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Untuk berkontribusi:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

### Coding Standards

- Gunakan TypeScript untuk type safety
- Follow ESLint rules
- Tulis kode yang clean dan readable
- Tambahkan komentar untuk logika kompleks
- Test fitur sebelum commit

---

## 📝 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Developer

**Bank Sampah Teratai**

- Website: [Bank Sampah Teratai](#)
- Email: [jsatriotomo@gmail.com]

---

## 📞 Kontak & Support

Jika ada pertanyaan atau butuh bantuan:

- 📧 Email: [jsatriotomo@gmail.com]
- 🐛 Issues: [GitHub Issues](https://github.com/jast75/webbst/issues)

---

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com/)
- Open source community

---

<div align="center">

**⭐ Jika proyek ini bermanfaat, berikan star di GitHub! ⭐**

Made with ❤️ for a cleaner environment

</div>
