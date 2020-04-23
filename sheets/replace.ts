import * as fs from "fs";

let config = fs.readFileSync(".config").toString();
let values: { [key: string]: string } = config.split("\n").reduce((pV, cV) => {
    let split = cV.split("=");
    pV[split.shift()!] = split.join("=");
    return pV;
}, {});

let javascript = fs.readFileSync("index.js").toString();
for (let key in values) {
    javascript = javascript.split(`\#${key}\#`).join(values[key]);
}
fs.writeFileSync("index.js", javascript);