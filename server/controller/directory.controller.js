import { readdir, stat, mkdir } from "fs/promises";
import path from "path";
import foldersData from '../folderDB.json' with { type: "json"}
import filesData from '../filesDB.json' with { type: "json"}

// Read
export const readDirectory = async (req, res) => {
  const {id} = req.params;
  if(!id){
    const folderData = foldersData[0]
   const files = folderData.files.map((fileId) => 
      filesData.find((file) => file.id === fileId)
    )
    res.json({...folderData, files})
  } else{
    const folderData = foldersData.find((folder) => folder.id === id)
    res.json(folderData)
  }
};

// create
export const createDir = async (req, res) => {
  const dirname = path.join("/", req.params[0]);
  try {
    await mkdir(`./storage/${dirname}`);
    res.json({ message: "Directory create" });
  } catch (error) {
    res.json({ message: "Cannot be empty" });
  }
}