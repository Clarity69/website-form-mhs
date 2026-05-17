# Sistem Manajemen Data Mahasiswa Berbasis Web

Aplikasi manajemen data mahasiswa modern, responsif, dan dinamis yang dibangun menggunakan teknologi web native (Vanilla HTML, CSS, dan JavaScript) tanpa framework frontend. Proyek ini memenuhi dan melampaui seluruh spesifikasi penugasan **Ujian Tengah Semester (UTS) Mata Kuliah Pemrograman Web**.

---

## Tautan Aplikasi (Live Deployment)
Aplikasi ini telah dideploy secara cloud dan dapat diakses secara publik melalui tautan berikut: <br>
**https://website-form-mhs.vercel.app/** 

---

## Stack Teknologi & Arsitektur
Proyek ini dibangun secara mandiri dengan arsitektur modern yang memisahkan *client-side logic* dengan cloud database melalui integrasi API:

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="40" alt="html5 logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="40" alt="css logo" />
  <img width="12" />
  <img src="https://simpleicons.org/icons/supabase.svg" height="40" alt="supabase logo" />
  <img width="12" />
  <img src="https://simpleicons.org/icons/vercel.svg" height="40" alt="vercel logo" />
</div>

* **Frontend**: HTML, CSS, JS
* **Backend Cloud Database**: Supabase BaaS (Backend-as-a-Service) via Supabase JS SDK.
* **Hosting Platform**: Vercel Cloud Platform.

---

## Struktur Folder Proyek
Proyek ini mengadopsi prinsip *Separation of Concerns* (SoC) untuk mempermudah pemeliharaan kode (*maintainability*):

```text
├── assets/          # Menyimpan aset gambar dan ikon aplikasi (edit, trash, dll.)
├── index.html       # Struktur utama aplikasi, form input, tabel, dan CDN SDK
├── script.js        # Logika Asynchronous CRUD, integrasi Supabase, & state management
├── style.css        # Variabel warna Catppuccin, layouting
└── README.md        # Dokumentasi teknis proyek