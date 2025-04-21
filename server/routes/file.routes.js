import express from "express";
import { uploadFile, openFile, renameFile, deleteFile } from "../controller/file.controller.js";

const router = express.Router()

router.post("/:filename", uploadFile)
router.get("/:id", openFile);
router.patch("/*", renameFile);
router.delete("/*", deleteFile);

export default router