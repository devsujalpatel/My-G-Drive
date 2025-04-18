import express from "express";
import { uploadFile, openFile, renameFile, deleteFile } from "../controller/file.controller.js";

const router = express.Router()

router.post("/*", uploadFile)
router.get("/*", openFile);
router.patch("/*", renameFile);
router.delete("/*", deleteFile);

export default router