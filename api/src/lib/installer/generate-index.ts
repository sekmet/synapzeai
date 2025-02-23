import * as fs from 'fs';
import * as handlebars from "handlebars";

// Read the template
const templateSource = fs.readFileSync("index.template.ts", "utf8");
const template = handlebars.compile(templateSource);

// Read the user configuration
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const context = config.features; // { lightningPlugin: true, telegramClient: false, bittensorPlugin: true }

// Generate the index.ts file
const output = template(context);
fs.writeFileSync("./src/index.ts", output);

console.log("src/index.ts has been generated.");
