import { scrapeAndExportProducts } from "./src/services/productScraper.js";
import { logger } from "./src/utils/logger.js";

(async function main() {
  // Helper to parse CLI arguments
  const getArgValue = (argName) => {
    const index = process.argv.indexOf(argName);
    return index !== -1 ? process.argv[index + 1] : null;
  };

  // Retrieve arguments
  const customFileName = getArgValue("--custom-file-name");
  let baseUrl = getArgValue("--base-url");
  const lastPage = parseInt(getArgValue("--last-page"), 10);
  const start = parseInt(getArgValue("--start"), 10) || 0;
  const size = parseInt(getArgValue("--size"), 10) || 72;

  if (!baseUrl) {
    logger.error(
      "Usage: node index.js --custom-file-name <fileName> --base-url <baseUrl> --last-page <lastPage> --start <start> --size <size>\n" +
        "Example: node index.js --custom-file-name results-folder --base-url https://example.com/products --last-page 5 --start 0 --size 72"
    );
    process.exit(1); // Exit with error code
  }

  // Extract the default file name from the URL if custom name is not provided
  const defaultFileName = baseUrl.split("/").pop().split(".")[0];
  const ref = customFileName || defaultFileName || new Date().toISOString();

  logger.info("Result folder: " + ref);
  logger.info("Scraping URL: " + baseUrl);
  logger.info("Last page to scrape: " + lastPage);
  logger.info("Start index: " + start);
  logger.info("Page size: " + size);

  let index = 1;

  try {
    while (true) {
      const pageStart = start + (index - 1) * size;
      const u = `${baseUrl}&product_list_order=newest&p=${index}&start=${pageStart}&sz=${size}`;
      const stop = await scrapeAndExportProducts(u, ref);

      if (stop || (lastPage && index === lastPage)) {
        break;
      }

      index++;
    }

    logger.info("Scraping and export completed successfully.");
  } catch (error) {
    logger.error("An error occurred:", error);
  }
})();
