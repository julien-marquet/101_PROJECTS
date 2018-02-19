const fs = require('fs');
const path = require('path');

const routeLoader = (api, access, sender, sessions) => {
    (function readRoute(dirR = __dirname) {
        fs.readdirSync(dirR).forEach((route) => {
            if (fs.lstatSync(`${dirR}/${route}`).isDirectory()) {
                readRoute(`${dirR}/${route}`);
            } else if (route.includes('.route.js')) {
                const name = route.slice(0, route.lastIndexOf('.route.js'));
                const loadedController = (function readController(dirC = path.join(__dirname, '..', 'controllers')) {
                    let res = null;
                    fs.readdirSync(`${dirC}`).some((controller) => {
                        if (fs.lstatSync(`${dirC}/${controller}`).isDirectory()) {
                            readController(`${dirC}/${controller}`);
                        } else if (controller.includes(`${name}.controller.js`)) {
                            res = require(path.join(dirC, controller))(sessions);
                            return (true);
                        }
                        return (false);
                    });
                    return res;
                }());
                require(path.join(dirR, route))(api, loadedController, access, sender);
            }
        });
    }());
};

module.exports = routeLoader;
