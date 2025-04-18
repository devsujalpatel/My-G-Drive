import { createWriteStream } from "fs";
import {rename, rm} from "fs/promises";
import path from "path";
  
  // Create

  export const uploadFile = async (req, res) => {
    const filePath = path.join("/", req.params[0]);
    const writeStream = createWriteStream(`./storage/${filePath}`);
    req.pipe(writeStream);
    req.on("end", () => {
      res.json({ message: "File Uploaded" });
    });
  }
  

  export const openFile = async (req, res) => {
    const filePath = path.join("/", req.params[0]);
    try {
      if (req.query.action === "download") {
        res.set("Content-Disposition", "attachment");
      }
      res.sendFile(`${process.cwd()}/storage/${filePath}`);
    } catch (error) {
      res.json({message: "File not found"})
    }
  }
  
  // Update
  
  export const renameFile = async (req, res) => {
    const filePath = path.join("/", req.params[0]);
    await rename(`./storage/${filePath}`, `./storage/${req.body.newFilename}`);
    res.json({ message: "Renamed" });
  }
  
  // Delete

  export const deleteFile = async (req, res ) => {
    const filePath = path.join("/", req.params[0]);
    try {
      await rm(`./storage/${filePath}`, {recursive: true});
      res.json({ message: "File Deleted Successfully" });
    } catch (err) {
      res.status(404).json({ message: "File Not Found!" });
    }
  }