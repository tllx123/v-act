module.exports = function(config){
    const scripts = ['import { ThemeFactory } from "@v-act/styles";'];
    scripts.push('ThemeFactory.register(' + JSON.stringify(config) + ')');
    return scripts.join('\n');
}