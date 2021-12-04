const init = require("./init");
let args = process.argv[2];
if(args){
    args = JSON.parse(args);
    init.apply(this, args);
}