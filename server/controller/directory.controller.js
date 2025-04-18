import { readdir, stat, mkdir } from "fs/promises";
import path from "path";

// Read

export const readDirectory = async (req, res) => {
  const dirname = path.join("/", req.params[0]);
  const fullDirPath = `./storage/${dirname ? dirname : ""}`;
  try {
    const filesList = await readdir(fullDirPath);
    const resData = [];
    for (const item of filesList) {
      const stats = await stat(`${fullDirPath}/${item}`);
      resData.push({ name: item, isDirectory: stats.isDirectory() });
    }
    res.json(resData);
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const createDir = async (req, res) => {
  const dirname = path.join("/", req.params[0]);
  try {
    await mkdir(`./storage/${dirname}`);
    res.json({ message: "Directory create" });
  } catch (error) {
    res.json({ message: "Cannot be empty" });
  }
}