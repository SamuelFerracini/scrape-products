import { createObjectCsvWriter } from "csv-writer";
import {
  getResultsPath,
  getStoragePath,
  saveFile,
  checkFileExists,
} from "./fileService.js";
import { logger } from "../utils/logger.js";
import fs from "fs";

export async function exportToCSV(products, ref, filename) {
  const headers = Object.keys(products[0]).map((key) => ({
    id: key,
    title: key,
  }));

  const path = getStoragePath("results", ref, filename + ".csv");

  saveFile(path, "");

  const csvWriter = createObjectCsvWriter({
    path: getResultsPath(ref, filename + ".csv"),
    header: headers,
  });

  return csvWriter.writeRecords(products);
}

export async function exportProducts(products, ref, filename = "products") {
  logger.info("Exporting to CSV and JSON...");

  // exportToCSV(products, ref, filename);

  const filePath = "./" + getResultsPath(ref, filename + ".json");

  try {
    // Check if the file exists
    const fileExists = await checkFileExists(filePath);

    let allProducts = products;

    if (fileExists) {
      // Read the existing file content
      const existingData = fs.readFileSync(filePath, "utf8");
      const existingProducts = JSON.parse(existingData);

      // Merge existing products with new products
      allProducts = [...existingProducts, ...products];
    }

    // Save merged products to file
    saveFile(filePath, JSON.stringify(allProducts, null, 2));
    logger.info("Export completed.");
  } catch (error) {
    logger.error("Failed to export products:", error);
  }
}
