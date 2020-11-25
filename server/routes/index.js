const renamer = (module_name) => module_name.replace(/Route/,'');
module.exports = require('require-directory')(module, {rename: renamer});
