import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  // Set auth tokens for sppg
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('boga_token', 'dummy_jwt_token');
    localStorage.setItem('boga_user', JSON.stringify({ role: 'sppg' }));
  });
  
  await page.goto("http://localhost:3000/sppg/admin/tender/create", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 1500));
  
  // Click the Jenjang Instansi dropdown button
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Jenjang Instansi') || text.includes('Semua')) {
      await btn.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: "D:/gem/sppg_admin_dropdown_fixed.png" });
  console.log("Screenshot saved to D:/gem/sppg_admin_dropdown_fixed.png");
  
  await browser.close();
}

main().catch(console.error);
