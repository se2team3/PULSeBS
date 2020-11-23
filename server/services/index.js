const renamer = (module_name) => module_name.replace(/Service/,'');
module.exports = require('require-directory')(module, {rename: renamer});
