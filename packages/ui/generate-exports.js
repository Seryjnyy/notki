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
        `./${componentsFolderPath}/${filePath}${name}${ext}`;
});
console.log(exportedComponents)