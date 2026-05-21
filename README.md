# 🤖 AI Agent Skills System

Folder `.agents/` adalah "otak" bagi asisten AI (seperti Gemini CLI, Claude Code, atau Cursor) yang bekerja di repositori ini. Folder ini berisi instruksi terstruktur yang memungkinkan AI untuk bekerja secara konsisten, benar, dan sesuai dengan standar tim Engineering tanpa perlu melakukan *reverse-engineering* terhadap basis kode secara berulang.

## 📁 Struktur Folder

- **`skills/`**: Berisi sub-direktori untuk setiap kemampuan (skill) spesifik.
  - **`SKILL.md`**: Titik masuk utama untuk setiap skill.
  - **`rules/`**, **`references/`**, **`templates/`**: Dokumentasi pendukung dan pola kode.

---

## 📚 Katalog Skill

Saat ini terdapat **13 skill** yang tersedia. Gunakan skill yang relevan dengan tugas yang sedang dikerjakan:

| Skill | Kapan Digunakan |
| :--- | :--- |
| `monorepo-workspace` | Saat menyentuh batas paket, impor, atau struktur monorepo. |
| `react-query` | Menulis/meninjau hook `useQuery`, `useMutation`, atau service API. |
| `forms-validation` | Bekerja dengan form (react-hook-form, zod). |
| `design-system` | Membangun komponen di `packages/ui` atau menggunakan token Tailwind. |
| `impeccable` | Merancang, meninjau UX/UI, atau memperbaiki tampilan frontend. |
| `next-best-practices` | Menulis kode App Router (RSC, async APIs, metadata). |
| `turborepo` | Konfigurasi `turbo.json` atau menggunakan CLI turbo. |
| `systematic-debugging` | Menyelidiki bug atau kegagalan test (sebelum mencoba fix). |
| `vercel-react-best-practices` | Optimasi performa (waterfalls, bundle size, re-renders). |
| `next-cache-components` | Menggunakan fitur Next.js 16+ PPR dan `use cache`. |

---

## 🛠️ Cara Penggunaan Berdasarkan Tools

### 1. Gemini CLI / Antigravity
Skill akan terdeteksi secara otomatis. Anda dapat memicu skill spesifik dengan prefix `$`:
```bash
$react-query — buatkan hook untuk layanan klaim
$systematic-debugging — investigasi kenapa build gagal
```

### 2. Claude Code
Claude akan membaca file `CLAUDE.md` yang merujuk ke folder ini. Anda juga bisa memuat manual:
```bash
/skill .agents/skills/react-query/SKILL.md
```

### 3. Cursor
Cursor menggunakan aturan di `.cursor/rules/*.mdc` yang merujuk ke folder `.agents/skills/`.

---

## 💡 Praktik Terbaik (Best Practices)

- ✅ **Muat di Awal**: Baca skill sebelum memulai tugas, bukan di tengah jalan.
- ✅ **Muat Banyak Skill**: Jika tugas mencakup banyak hal (misal: Form + API), muat kedua skill tersebut.
- ✅ **Percayai Skill**: Instruksi di sini adalah standar proyek yang mengesampingkan kebiasaan umum AI.
- ❌ **Jangan Muat Semua**: Memuat terlalu banyak skill yang tidak relevan akan membingungkan AI.

---

## ➕ Menambahkan Skill Baru

1. Buat direktori: `.agents/skills/<nama-skill>`
2. Buat `SKILL.md` dengan frontmatter standar:
   ```markdown
   ---
   name: <nama-skill>
   version: 1.0.0
   description: Gunakan saat...
   tags: [tag1, tag2]
   ---
   # Judul Skill
   ...
   ```
3. Daftarkan di katalog utama dalam `.agents/skills/README.md`.

---

*Sistem ini dirancang untuk memastikan AI bukan sekadar alat bantu ketik, tapi rekan pengembang yang memahami arsitektur kita.*
