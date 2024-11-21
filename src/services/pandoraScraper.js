import { load } from "cheerio";

export function scrapeProducts(html) {
  debugger;
  const $ = load(html);
  const products = [];

  $(".product-tile").each((i, el) => {
    const productData = JSON.parse($(el).attr("data-tealium-view")).products[0];

    products.push(productData);
  });

  return products;
}
