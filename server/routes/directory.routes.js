import express from "express";
import { createDir, readDirectory } from "../controller/directory.controller.js";

const router = express.Router()


router.get("/?*", readDirectory);
router.post("/*", createDir);

export default router