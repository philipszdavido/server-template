import {cwd} from "process";
import fs from "fs";

const readFileFromWebFolder = () => {
    const webFolderFiles = cwd() + "/test/fs.ts";

    return fs.readFileSync(webFolderFiles).toString()
}

console.log(readFileFromWebFolder())