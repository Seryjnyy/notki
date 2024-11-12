const fs = require("fs");
const path = require("path");

const componentsFolderPath = "src/components/ui";

const componentsDir = path.join(__dirname, componentsFolderPath);
const packageJSONPath = path.join(__dirname, "package.json");

const files = fs.readdirSync(componentsDir, { recursive: true });
const exportedComponents = {};

files.forEach((file) => {
    const ext = path.extname(file);

    // If "" then its a folder so return
    if (ext == "") {
        return;
    }

    // Get the directory of the file, if its "." then its the root and we don't need to add anything
    // Otherwise we add the directory to the export path
    const dir = path.dirname(file);
    const filePath = dir == "." ? "" : `${dir.replace("\\", "/")}/`;

    const name = path.basename(file, ext);

    //
    exportedComponents[`./${filePath}${name}`] =
        `./${componentsFolderPath}/${filePath}${name}`;
});

// Read in package.json
const packageJson = JSON.parse(fs.readFileSync(packageJSONPath, "utf8"));

// Update exports
packageJson.exports = exportedComponents;

// Increment the version (not necessary but eh)
const version = packageJson.version.split(".");
const newVersion = Number(version[2]) + 1;
packageJson.version = version[0] + "." + version[1] + "." + newVersion;

// Write the package.json file
fs.writeFileSync(packageJSONPath, JSON.stringify(packageJson, null, 2));
console.log("Exports generated successfully.");
