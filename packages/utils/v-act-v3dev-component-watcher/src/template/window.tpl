import React from 'react';
import {Control} from "@v-act/schema-types";
import {layoutControls} from "@v-act/widget-utils";
import {convert} from "@v-act/jgcomponent";
import {JGSpacer,convert as convertJGSpacer} from "@v-act/jgspacer";
{{@ importScripts}}

const controlConverts = {{@ controlConvertMap}};
const controlDefines = {{@ controlDefines}};
constrolConverts.JGSpacer = convertJGSpacer;

const windowObjs = {{@ windowJsonScript}};

const render = function(controls: Array<Control>): JSX.Element|null{
    controls = layoutControls(controls,controlDefines);
    if(controls&&controls.length>0){
        return <React.Fragment>{
            controls.map((control)=>{
                return (<React.Fragment key={control.properties.code}>{
                    controlConverts[control.type] ? controlConverts[control.type](control,render):null
                }</React.Fragment>);
            })
        }</React.Fragment>
    }
    return null;
}

function Index(){
    return (
        <React.Fragment>
            {convert(windowObjs,render)}
        </React.Fragment>   
    );
}

export default Index;