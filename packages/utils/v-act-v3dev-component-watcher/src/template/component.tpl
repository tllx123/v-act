import {parse as parseComponent} from '@v-act/component-schema-utils';
const componentSchema = {{@ componentSchema}}
const parse = function(){
    parseComponent(componentSchema);
}
export {parse}