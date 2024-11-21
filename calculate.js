import {
  getResultsPath,
  readFile,
  saveFile,
} from "./src/services/fileService.js";
import { exportProducts } from "./src/services/productService.js";

// Function to process command line arguments
function processArguments(resultFolder, rate, discount) {
  // Convert rate and discount to numbers
  const numericRate = parseFloat(rate);
  const numericDiscount = parseFloat(discount);

  if (isNaN(numericRate) || isNaN(numericDiscount)) {
    console.error("Rate and discount must be valid numbers.");
    return;
  }

  // Calculate the final rate after discount
  const distcountInPercentage = numericDiscount > 0 ? numericDiscount / 100 : 1;

  const products = JSON.parse(
    readFile(`./storage/results/${resultFolder}/products.json`)
  );

  const calculated = products.map((p) => ({
    ...p,
    price_in_thai: (p.price * distcountInPercentage * rate).toFixed(2),
  }));

  exportProducts(
    calculated,
    resultFolder,
    `post-calculation-rate-${rate}-discount-${discount}`
  );
}

// Get command line arguments
const args = process.argv.slice(2);

// Check if the correct number of arguments are provided
if (args.length !== 3) {
  console.error("Usage: node script.js <resultFolder> <rate> <discount>");
  process.exit(1);
}

// Call the function with the command line arguments
processArguments(args[0], args[1], args[2]);
