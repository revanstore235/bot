const { mainMenu } = require('./main.js');
const general = require('./general/index.js');
const funMenu = require('./funMenu/index.js');
const groupMenu = require('./groupMenu/index.js');

module.exports = {
    mainMenu,
    ...general,
    ...funMenu,
    ...groupMenu
};