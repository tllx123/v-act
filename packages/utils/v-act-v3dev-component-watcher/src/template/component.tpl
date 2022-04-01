import {parse as parseComponent} from '@v-act/component-schema-utils';
const componentSchema = {{@ componentSchema}}
const parse = function(){
    parseComponent(componentSchema);
}
const returnComponentSchema = function(){
console.log(1212)
    return componentSchema
}
export {parse,returnComponentSchema}