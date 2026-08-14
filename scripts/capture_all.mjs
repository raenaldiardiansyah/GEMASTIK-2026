import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = path.resolve('c:/gemastik/Gemastik-B.O.G.A/screenshots');

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
    role: 'admin',
    viewport: { width: 1440, height: 900 }
  },
  {
    name: '8.3_verifikasi_supplier.png',
    url: 'http://localhost:3000/goverment/verifikasi-supplier',
    role: 'admin',
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
    role: 'admin',
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
    role: 'admin',
    viewport: { width: 1440, height: 900 }
  }
];

async function run() {
  console.log('🚀 Launching Edge browser for screenshots...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  for (const t of targets) {
    console.log(`📸 Capturing ${t.name} from ${t.url}...`);
    await page.setViewport(t.viewport);

    // Set mock authentication cookies/localStorage if needed
    if (t.role) {
      await page.setCookie(
        { name: 'boga_is_auth', value: 'true', domain: 'localhost', path: '/' },
        { name: 'boga_token', value: 'dummy_token', domain: 'localhost', path: '/' },
        { name: 'boga_user_role', value: t.role, domain: 'localhost', path: '/' }
      );
    }

    try {
      await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 30000 });
      // Wait for animations and map rendering
      await new Promise(r => setTimeout(r, 3000));

      const outPath = path.join(OUTPUT_DIR, t.name);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`✅ Saved: ${outPath}`);
    } catch (err) {
      console.error(`❌ Failed ${t.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('🎉 All screenshots captured successfully!');
}

run().catch(console.error);
