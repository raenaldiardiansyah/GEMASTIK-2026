import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = path.resolve('D:/gem');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const targets = [
  {
    name: '8.1_landing_page.png',
    url: 'http://localhost:3000/',
    role: null,
    viewport: { width: 1440, height: 900 }
  },
  {
    name: '8.2_dashboard_auditor.png',
    url: 'http://localhost:3000/goverment/dashboard',
    role: 'goverment',
    viewport: { width: 1440, height: 900 }
  },
  {
    name: '8.3_verifikasi_supplier.png',
    url: 'http://localhost:3000/goverment/verifikasi-supplier',
    role: 'goverment',
    viewport: { width: 1440, height: 900 }
  },
  {
    name: '8.4_verifikasi_pembayaran.png',
    url: 'http://localhost:3000/sppg/verifikasi-pembayaran',
    role: 'sppg',
    viewport: { width: 1440, height: 900 }
  },
  {
    name: '8.5_monitoring_distribusi.png',
    url: 'http://localhost:3000/logistik/monitoring-distribusi',
    role: 'logistik',
    viewport: { width: 1440, height: 900 }
  },
  {
    name: '8.6_audit_pangan.png',
    url: 'http://localhost:3000/goverment/audit-pangan',
    role: 'goverment',
    viewport: { width: 1440, height: 900 }
  },
  {
    name: '8.7_feedback_guru_sekolah.png',
    url: 'http://localhost:3000/sekolah/feedback',
    role: 'sekolah',
    viewport: { width: 1440, height: 900 }
  },
  {
    name: '8.8_dashboard_reputasi.png',
    url: 'http://localhost:3000/goverment/dashboard-reputasi',
    role: 'goverment',
    viewport: { width: 1440, height: 900 }
  }
];

async function run() {
  console.log('🚀 Menghubungkan ke Edge Browser & Server Produksi...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--allow-running-insecure-content'
    ]
  });

  const page = await browser.newPage();

  for (const t of targets) {
    console.log(`📸 Mengambil ${t.name} dari ${t.url}...`);
    await page.setViewport(t.viewport);

    // Set Cookies
    if (t.role) {
      await page.setCookie(
        { name: 'boga_is_auth', value: 'true', domain: 'localhost', path: '/' },
        { name: 'boga_token', value: 'dummy_jwt_token', domain: 'localhost', path: '/' },
        { name: 'boga_user_role', value: t.role, domain: 'localhost', path: '/' }
      );
    }

    try {
      await page.goto(t.url, { waitUntil: 'networkidle0', timeout: 45000 });

      // Injeksi LocalStorage langsung
      if (t.role) {
        await page.evaluate((role) => {
          localStorage.setItem('boga_is_auth', 'true');
          localStorage.setItem('boga_token', 'dummy_jwt_token');
          localStorage.setItem('boga_user_role', role);
          localStorage.setItem('boga_user', JSON.stringify({
            id: 'USR-DEV001',
            nama: 'Pengguna Demo ' + role,
            email: 'admin@gizantara.id',
            peran: role
          }));
        }, t.role);
      }

      // Auto scroll down and up to trigger IntersectionObserver and image loads
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 400;
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

      // Tunggu render grafik/peta/animasi
      await new Promise(r => setTimeout(r, 4000));

      const outPath = path.join(OUTPUT_DIR, t.name);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`✅ Sukses Tersimpan: ${outPath}`);
    } catch (err) {
      console.error(`❌ Gagal ${t.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('🎉 Selesai! Semua screenshot versi produksi telah disimpan ke D:\\gem');
}

run().catch(console.error);
