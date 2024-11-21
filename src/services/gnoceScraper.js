import { load } from "cheerio";

export function scrapeProducts(html) {
  const $ = load(html);
  const products = [];

  $(".product-item-info").each((index, element) => {
    const product = {};
    product.url = $(element).find("a.product-item-photo").attr("href");
    product.image = $(element).find("img.product-image-photo").attr("src");
    product.name = $(element).find(".item-title").text().trim();
    product.image2 = $(element).find("img.list-hover-image").attr("src");

    debugger;

    const gaInfo = $(element).find("a.product-item-photo").attr("ga-info");
    if (gaInfo) {
      const gaData = JSON.parse(gaInfo);

      product.id = gaData.item_id;
      product.sku = gaData.sku;
      product.brand = gaData.item_brand;
      product.category = gaData.item_category;
      product.subCategory = gaData.item_category2;
      product.variant = gaData.item_variant;
      product.price = gaData.price;
      product.quantity = gaData.quantity;
    } else {
      product.price = $(element).find(".price-box .price").text().trim();
    }

    product.promotion = $(element).find(".in-aug span").text().trim();

    products.push(product);
  });

  return products;
}
