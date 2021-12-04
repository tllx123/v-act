module.exports = function(configs){
    const scripts = ['import { ThemeFactory } from "@v-act/styles";'];
    scripts.push('ThemeFactory.register(' + JSON.stringify(configs) + ')');
    return scripts.join('\n');
}