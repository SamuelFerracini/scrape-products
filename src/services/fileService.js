import fs from "fs";
import path from "path";
import crypto from "crypto";

export function ensureDirectories(filePath) {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getFileNameFromUrl(url, extension = "html") {
  const hash = crypto.createHash("sha256").update(url).digest("hex");
  return `${hash}.${extension}`;
}

export function getStoragePath(...paths) {
  return path.join("storage", ...paths);
}

export function getResultsPath(...paths) {
  return getStoragePath("results", ...paths);
}

export function getCacheFilePath(url, cacheDirName = "cache") {
  const cacheFileName = getFileNameFromUrl(url);
  return getStoragePath(cacheDirName, cacheFileName);
}

export function readFile(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : null;
}

export function saveFile(filePath, content) {
  ensureDirectories(filePath);
  fs.writeFileSync(filePath, content);
}

export async function checkFileExists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (error) {
    return false;
  }
}
