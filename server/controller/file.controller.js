import { createWriteStream } from "fs";
import { rename, rm, writeFile } from "fs/promises";
import path from "path";
import filesData from "../filesDB.json" with {type: "json"};

// Create

export const uploadFile = async (req, res) => {
  const { filename } = req.params;
  const extension = path.extname(filename);
  const id = crypto.randomUUID();
  const fullFileName = `${id}${extension}`;
  const writeStream = createWriteStream(`./storage/${fullFileName}`);
  req.pipe(writeStream);
  req.on("end", () => {
    filesData.push({
      id,
      extension,
      name: filename
    })
    writeFile('./filesDB.json', JSON.stringify(filesData))
    res.json({ message: "File Uploaded" });
  });
};

export const openFile = async (req, res) => {
  const {id} = req.params;
  const fileData = filesData.find((file) => file.id === id)
  try {
    if (req.query.action === "download") {
      res.set("Content-Disposition", "attachment");
    }
    res.sendFile(`${process.cwd()}/storage/${id}${fileData.extension}`);
  } catch (error) {
    res.json({ message: "File not found" });
  }
};

// Update

export const renameFile = async (req, res) => {
  const {id} = req.params;
  const fileData = filesData.find((file) => file.id === id)
  fileData.name = req.body.newFilename
  writeFile('./filesDB.json', JSON.stringify(filesData))
  res.json({ message: "Renamed" });
};

// Delete

export const deleteFile = async (req, res) => {
  const {id} = req.params;
  const fileIndex = filesData.findIndex((file) => file.id === id)
  const fileData = filesData[fileIndex]
  try {
    await rm(`./storage/${id}${fileData.extension}`, { recursive: true });
    filesData.splice(fileIndex)
    writeFile('./filesDB.json', JSON.stringify(filesData))
    res.json({ message: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ message: "File Not Found!" });
  }
};
