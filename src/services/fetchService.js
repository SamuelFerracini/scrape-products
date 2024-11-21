import { launchBrowser } from "./browserService.js";

export async function fetchPageContent(url) {
  const browser = await launchBrowser();
  const content = await browser.getPageContent(url);
  await browser.close(); // Close the browser after usage
  return content;
}
