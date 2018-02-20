const fs = require('fs');
const Ajv = require('ajv');

const ajv = new Ajv();

const schemaLoader = () => {
    (function readDir(dir = __dirname) {
        fs.readdirSync(dir).forEach((file) => {
            if (fs.lstatSync(`${dir}/${file}`).isDirectory()) {
                readDir(`${dir}/${file}`);
            } else if (file.includes('.schema.js')) {
                ajv.addSchema(require(`${dir}/${file}`), file.slice(0, file.lastIndexOf('.schema.js')));
            }
        });
    }());
    return ajv;
};

module.exports = schemaLoader;
