import puppeteer from "puppeteer";

export async function launchBrowser() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  const getPageContent = async (url) => {
    const response = await page.goto(url, { waitUntil: "networkidle2" });
    return response.buffer();
  };

  return {
    getPageContent,
    close: () => browser.close(),
  };
}
