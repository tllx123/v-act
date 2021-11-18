module.exports = function(config){
    const scripts = ['import { I18nFactory } from "@v-act/i18n";'];
    scripts.push('I18nFactory.register(' + JSON.stringify(config) + ')');
    return scripts.join('\n');
}