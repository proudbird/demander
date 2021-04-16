const demander  = require('../index');
const path      = require('path');


demander.clearCache = false;
demander.hideGlobals = ['__dirname'];


const filename = path.join(__dirname, 'modules', 'module_01.js');

const options = {
  hideGlobals: undefined
}

const tester = demander(filename, { foo: 'baz' }, { user: "Max" }, options);

console.log(tester);