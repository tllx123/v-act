const { executeCommand } = require('./utils');
module.exports = function(){
    return executeCommand("next export");
}