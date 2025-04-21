import { createWriteStream } from "fs";
import { rename, rm, writeFile } from "fs/promises";
import path from "path";
import filesData from "../filesDB.json" with {type: "json"};
import foldersData from '../folderDB.json' with { type: "json"};

// Create
export const uploadFile = async (req, res) => {
  const { filename } = req.params;
  const  parentDirId = req.headers.parentdirid || foldersData[0].id;
  const extension = path.extname(filename);
  const id = crypto.randomUUID();
  const fullFileName = `${id}${extension}`;
  const writeStream = createWriteStream(`./storage/${fullFileName}`);
  req.pipe(writeStream);
  req.on("end", () => {
    filesData.push({
      id,
      extension,
      name: filename,
      parentDirId
    })
    const parentDirData = foldersData.find((folderData) => folderData.id === parentDirId)
    parentDirData.files.push(id)
    writeFile('./filesDB.json', JSON.stringify(filesData))
    writeFile('./folderDB.json', JSON.stringify(foldersData))
    res.json({ message: "File Uploaded" });
  });
};

// Read
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
    filesData.splice(fileIndex, 1)
    const parentDirData = foldersData.find((folderData) => folderData.id === fileData.parentDirId)
    parentDirData.files = parentDirData.files.filter((fileId) => fileId !== id)
    writeFile('./filesDB.json', JSON.stringify(filesData))
    writeFile('./folderDB.json', JSON.stringify(foldersData))
    res.json({ message: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ message: "File Not Found!" });
  }
};
