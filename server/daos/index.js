const renamer = (module_name) => module_name.replace(/_dao/,'');
module.exports = require('require-directory')(module, {rename: renamer});
