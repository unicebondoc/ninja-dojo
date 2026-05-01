import { chromium } from "playwright";

const url = process.env.URL || "http://127.0.0.1:3458";
const out = process.env.OUT || "screenshots/pr0-empty-town.png";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
