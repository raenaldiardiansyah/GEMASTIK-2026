import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = path.resolve('D:/gem'); // Langsung simpan ke D:\gem

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ⚠️ GANTI 'boga_token' di bawah dengan token ASLI hasil login manual.
// Cara ambil: login manual di Edge -> F12 -> Application -> Local Storage
// (atau Cookies) -> copy value 'boga_token' yang asli.
// Kalau backend kamu cuma cek "ada token atau nggak" (gak validasi isi JWT-nya),
// dummy_jwt_token ini masih bisa jalan. Tapi kalau backend validasi beneran,
// token palsu bakal ditolak -> ke-redirect ke login -> SS jadi kacau.
const AUTH_TOKEN = 'dummy_jwt_token';

const targets = [
  {
    name: '8.1_landing_page.png',
    url: 'http://localhost:3000/',
    role: null,
    viewport: { width: 1440, height: 900 },
    fullPage: false,
    extraWaitMs: 2000
  },
  {
    name: '8.2_dashboard_auditor.png',
    url: 'http://localhost:3000/goverment/dashboard',
    role: 'goverment',
    viewport: { width: 1440, height: 900 },
    fullPage: false,
    extraWaitMs: 5000 // dashboard biasanya ada chart -> kasih waktu lebih
  },
  {
    name: '8.3_verifikasi_supplier.png',
    url: 'http://localhost:3000/goverment/verifikasi-supplier',
    role: 'goverment',
    viewport: { width: 1440, height: 900 },
    fullPage: false,
    extraWaitMs: 3000
  },
  {
    name: '8.4_verifikasi_pembayaran.png',
    url: 'http://localhost:3000/sppg/verifikasi-pembayaran',
    role: 'sppg',
    viewport: { width: 1440, height: 900 },
    fullPage: false,
    extraWaitMs: 3000
  },
  {
    name: '8.5_monitoring_distribusi.png',
    url: 'http://localhost:3000/logistik/monitoring-distribusi',
    role: 'logistik',
    viewport: { width: 1440, height: 900 },
    fullPage: false,
    extraWaitMs: 5000 // ada peta -> tile map butuh waktu render
  },
  {
    name: '8.6_audit_pangan.png',
    url: 'http://localhost:3000/goverment/audit-pangan',
    role: 'goverment',
    viewport: { width: 1440, height: 900 },
    fullPage: false,
    extraWaitMs: 4000
  },
  {
    name: '8.7_feedback_guru_sekolah.png',
    url: 'http://localhost:3000/sekolah/feedback',
    role: 'sekolah',
    viewport: { width: 1440, height: 900 },
    fullPage: false,
    extraWaitMs: 2500
  },
  {
    name: '8.8_dashboard_reputasi.png',
    url: 'http://localhost:3000/goverment/dashboard-reputasi',
    role: 'goverment',
    viewport: { width: 1440, height: 900 },
    fullPage: false,
    extraWaitMs: 5000
  }
];

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
}

async function waitForImages(page) {
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    await Promise.all(
      imgs.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        });
      })
    );
  });
}

async function run() {
  console.log('🚀 Launching Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true, // Ubah ke false kalau mau lihat browser jalan
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--allow-running-insecure-content'
    ]
  });

  for (const t of targets) {
    console.log(`\n📸 Capturing ${t.name} from ${t.url}...`);

    // Page baru untuk tiap target -> menghindari state/cache nyangkut
    // dari halaman sebelumnya (salah satu penyebab "ambil versi jadul")
    const page = await browser.newPage();
    await page.setViewport(t.viewport);
    await page.setCacheEnabled(false); // WAJIB: matikan cache HTTP

    try {
      if (t.role) {
        // Cookie di-set sebelum navigasi (ini sudah benar sejak awal)
        await page.setCookie(
          { name: 'boga_is_auth', value: 'true', domain: 'localhost', path: '/' },
          { name: 'boga_token', value: AUTH_TOKEN, domain: 'localhost', path: '/' },
          { name: 'boga_user_role', value: t.role, domain: 'localhost', path: '/' }
        );

        // 🔑 FIX UTAMA: localStorage di-set SEBELUM script halaman jalan
        // pakai evaluateOnNewDocument, BUKAN page.evaluate() setelah goto.
        // Di script lama, localStorage baru diisi setelah React sempat
        // render duluan dengan localStorage kosong -> app sempat "melihat"
        // kondisi belum login sebelum akhirnya di-inject.
        await page.evaluateOnNewDocument(
          (role) => {
            localStorage.setItem('boga_is_auth', 'true');
            localStorage.setItem('boga_token', 'dummy_jwt_token');
            localStorage.setItem('boga_user_role', role);
          },
          t.role
        );
      }

      // Cache-busting query param tambahan, jaga-jaga ada layer cache lain
      const url = new URL(t.url);
      url.searchParams.set('_ss', Date.now().toString());

      await page.goto(url.toString(), {
        waitUntil: ['load', 'networkidle0'],
        timeout: 60000
      });

      // Deteksi kalau ke-redirect ke login (tanda token/cookie ditolak backend)
      if (/\/login/i.test(page.url())) {
        console.warn(
          `⚠️  ${t.name}: sepertinya ke-redirect ke halaman login (${page.url()}). ` +
          `Cek apakah AUTH_TOKEN masih valid / backend butuh token asli.`
        );
      }

      // Tunggu network bener-bener tenang lagi (fetch API yang jalan
      // setelah hydration React biasanya baru mulai di titik ini)
      await page.waitForNetworkIdle({ idleTime: 1000, timeout: 30000 }).catch(() => {});

      // Scroll dulu biar lazy-load image / animasi kepicu
      await autoScroll(page);

      // Tunggu semua <img> selesai load
      await waitForImages(page).catch(() => {});

      // Delay tambahan khusus per halaman (chart/peta butuh lebih lama)
      await new Promise((r) => setTimeout(r, t.extraWaitMs ?? 3000));

      const outPath = path.join(OUTPUT_DIR, t.name);
      await page.screenshot({ path: outPath, fullPage: t.fullPage ?? false });
      console.log(`✅ Saved: ${outPath}`);
    } catch (err) {
      console.error(`❌ Failed ${t.name}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\n🎉 Selesai! Semua gambar tersimpan di D:\\gem');
}

run().catch(console.error);
