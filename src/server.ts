import http from "http"
import fs from "fs"

const PORT = 3000

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    console.log(req.url, req.method)

    const urlParts = req.url?.split("/").filter(Boolean)

    console.log(urlParts)

    // check for root and serve the index
    if(!urlParts?.length) {

        res.writeHead(200)
        const file = fs.readFileSync('./web/index.html')
        res.end(file)
    
    }

    if(urlParts?.[0] === "style.css") {
        
        res.writeHead(200)
        const file = fs.readFileSync('./web/style.css')
        res.end(file)

    }

    if(urlParts?.[0] === "favicon.ico") {
        
        try {
            const file = fs.readFileSync('./web/favicon.ico')
            res.writeHead(200)
            res.end(file)
       
        } catch (error) {
            res.writeHead(404)
        }
    }

    res.end()


})

console.log("Server listening at " + PORT)
server.listen(PORT)