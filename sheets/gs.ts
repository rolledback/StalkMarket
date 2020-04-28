import * as fs from "fs";

try {
    let config = fs.readFileSync(".gs-config").toString();

    let secrets: { [key: string]: string } = {};
    let deletes: string[] = [];

    config.split("\n").forEach((line) => {
        if (line.startsWith("$")) {
            let split = line.substr(1).split("=");
            secrets[split.shift()!] = split.join("=");
        }

        if (line.startsWith("!")) {
            deletes.push(line.substr(1));
        }
    });

    let javascript = fs.readFileSync("./out/index.js").toString();

    for (let key in secrets) {
        console.log(JSON.stringify(secrets[key]))
        javascript = javascript.split(`\$${key}`).join(secrets[key])
    }

    for (let str of deletes) {
        javascript = javascript.split(str).join("");
    }

    javascript = javascript.split("\n").filter((l) => l !== "\r" && l.length > 0).join("\n");

    fs.writeFileSync("./out/index.gs.js", javascript);
} catch {
    // do nothing
}

