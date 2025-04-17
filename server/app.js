import { createReadStream } from "fs";
import { open, readdir, readFile } from "fs/promises";
import http from "http";

const server = http.createServer(async (req, res) => {
  if (req.url === "/favicon.ico" && req.url === "/style.css") {
    return res.end("No Such file");
  }
  if (req.url === "/") {
    serveDirectory(req, res);
  } else {
    try {
      const [url, queryStr] = req.url.split("?")
      const fileHandle = await open(`./storage${decodeURIComponent(url)}`);
      const stats = await fileHandle.stat();
      if (stats.isDirectory()) {
        serveDirectory(req, res);
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

async function serveDirectory(req, res) {
  const itemList = await readdir(`./storage${req.url}`);
  let dynamicHTML = "";
  itemList.forEach((item) => {
    dynamicHTML += `<li>${item}
    <a href=".${
      req.url === "/" ? "" : req.url
    }/${item}?action=open"> Open </a>
        <a href=".${
          req.url === "/" ? "" : req.url
        }/${item}?action=download">Download</a>
      </li>`;
  });
  const htmlBoiler = await readFile("./public/boiler.html", "utf-8");
  res.end(htmlBoiler.replace("${dynamicHTML}", dynamicHTML));
}

server.listen(80, "0.0.0.0", () => {
  console.log("Server started");
});
