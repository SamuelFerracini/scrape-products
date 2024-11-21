import { fetchPageContent } from "../services/fetchService.js";
import {
  readFile,
  saveFile,
  getCacheFilePath,
  getResultsPath,
} from "../services/fileService.js";
import { exportProducts } from "../services/productService.js";
import { logger } from "../utils/logger.js";

import * as PandoraScraper from "./pandoraScraper.js";
import * as GnoceScraper from "./gnoceScraper.js";

let firstProductsLength = null;

export async function scrapeAndExportProducts(url, ref) {
  const cacheFilePath = getCacheFilePath(url);

  let content = readFile(cacheFilePath);

  if (!content) {
    content = await fetchPageContent(url);
    debugger;
    saveFile(cacheFilePath, content);
  }

  debugger;

  const type = url.includes("pandora") ? "pandora" : "gnoce";

  const products = scrapeProducts(content, type);

  if (!firstProductsLength) {
    firstProductsLength = products.length;
  }

  logger.info("Products found: " + products.length);

  if (products.length === 0) {
    return true;
  }

  await exportProducts(products, ref);

  if (firstProductsLength !== products.length) {
    return true;
  }
}

function scrapeProducts(html, type = "gnoce") {
  return {
    pandora: PandoraScraper.scrapeProducts,
    gnoce: GnoceScraper.scrapeProducts,
  }[type](html);
}
