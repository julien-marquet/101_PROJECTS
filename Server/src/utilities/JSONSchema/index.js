const fs = require('fs');
const $RefParser = require('json-schema-ref-parser');

process.chdir('src/utilities/JSONSchema');

const schemaLoader = async () => {
    const array = [];
    (async function readDir(dir = __dirname) {
        fs.readdirSync(dir).forEach(async (file) => {
            if (fs.lstatSync(`${dir}/${file}`).isDirectory()) {
                await readDir(`${dir}/${file}`);
            } else if (file.includes('.schema.js')) {
                array[file.slice(0, file.lastIndexOf('.schema.json'))] = await $RefParser.dereference(require(`${dir}/${file}`));
            }
        });
    }());
    process.chdir('../../../');
    return array;
};

module.exports = schemaLoader;
