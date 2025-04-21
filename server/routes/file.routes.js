import express from "express";
import { uploadFile, openFile, renameFile, deleteFile } from "../controller/file.controller.js";

const router = express.Router()

router.post("/:filename", uploadFile)
router.get("/:id", openFile);
router.patch("/:id", renameFile);
router.delete("/:id", deleteFile);

export default router