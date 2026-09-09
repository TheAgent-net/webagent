import puppeteer from "puppeteer-core";

const url = process.argv[2] || "http://127.0.0.1:8799/";
const out = process.argv[3] || "/tmp/clone-hero.png";

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--window-size=1440,900"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.setUserAgent(
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
);
page.on("response", (res) => {
  if (res.status() >= 400) console.error("fail", res.status(), res.url().slice(0, 120));
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
await new Promise((r) => setTimeout(r, 2500));
const title = await page.title();
const fab = await page.$(".wa-fab");
const h1 = await page.$eval("h1", (el) => el.textContent || "").catch(() => "");
console.log(JSON.stringify({ title, fab: !!fab, h1: h1.slice(0, 80) }));
await page.screenshot({ path: out });
await browser.close();
