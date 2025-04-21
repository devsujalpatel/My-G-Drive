import express from "express";
import { createDir, readDirectory } from "../controller/directory.controller.js";

const router = express.Router()


router.get("/:id?", readDirectory);
router.post("/:id", createDir);

export default router