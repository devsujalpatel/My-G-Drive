import { createReadStream } from "fs";
import { open, readdir, readFile } from "fs/promises";
import http from "http";

const server = http.createServer(async (req, res) => {
    if(req.url === '/storage/favicon.ico'){
        const readStrem = createReadStream('favicon.ico')
        readStrem.pipe(res)
    }
  if (req.url === "/") {
    serveDirectory(req, res)
  } else {
    try {
      const fileHandle = await open(`./storage${decodeURIComponent(req.url)}`);
      const stats = await fileHandle.stat();
      if (stats.isDirectory()) {
        serveDirectory(req, res)
      } else {
        const readStream = fileHandle.createReadStream();
        readStream.pipe(res);
      }
    } catch (error) {
      console.log(error.message);
      res.end("Not found!");
    }
  }
});

async function serveDirectory(req, res){
    const itemList = await readdir(`./storage${req.url}`);
    let dynamicHTML = "";
    itemList.forEach((item) => {
      dynamicHTML += `<li><a href=".${
        req.url === '/' ? '' : req.url
      }/${item}">${item}</a></li>`;
    });
    const htmlBoiler = await readFile("./boiler.html", "utf-8");
    res.end(htmlBoiler.replace("${dynamicHTML}", dynamicHTML));
}

server.listen(80, "0.0.0.0", () => {
  console.log("Server started");
});
