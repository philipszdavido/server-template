import http from "http";
import fs from "fs";
import { cwd } from "process";

const PORT = 3000;

const readFileFromWebFolder = (file: string) => {
    const webFolderFiles = cwd() + "/src/web/";

    const basePath = webFolderFiles + file;
    return fs.readFileSync(basePath)
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    const urlParts = req.url?.split("/").filter(Boolean);

    console.log(urlParts);

    // check for root and serve the index
    if (!urlParts?.length) {
        try {
            const file = readFileFromWebFolder('index.html');
            res.writeHead(200);
            res.end(file);
        } catch (error) {
            console.error("Error reading index.html:", error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    }

    if (urlParts?.[0] === "style.css") {
        try {
            const file = readFileFromWebFolder('style.css');
            res.writeHead(200);
            res.end(file);
        } catch (error) {
            console.error("Error reading style.css:", error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    }

    if (urlParts?.[0] === "favicon.ico") {
        try {
            const file = readFileFromWebFolder('favicon.ico');
            res.writeHead(200);
            res.end(file);
        } catch (error) {
            console.error("Error reading favicon.ico:", error);
            res.writeHead(404);
            res.end('File Not Found');
        }
    }

    res.end();
});

console.log("Server listening at http://localhost:" + PORT);
server.listen(PORT);
