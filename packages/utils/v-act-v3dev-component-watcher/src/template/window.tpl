import React from 'react';
import { useRouter } from 'next/router';
import {Control,ControlReact} from "@v-act/schema-types";
import {layoutControls} from "@v-act/widget-utils";
import {convert} from "@v-act/jgcomponent";
import {JGSpacer as JGSpacer1,convert as convertJGSpacer1} from "@v-act/jgspacer";
import {JGGroupPanel as JGGroupPanel1,convert as convertJGGroupPanel1} from "@v-act/jggrouppanel";
{{@ importScripts}}

const controlConverts: { [widgetType: string]: Function } = {{@ controlConvertMap}};
const controlDefines: {
  [widgetType: string]: {
    defaultProps?:
      | {
          [pro: string]: any
        }
      | undefined
  }
} = {{@ controlDefines}};
controlConverts.JGSpacer = convertJGSpacer1;
controlConverts.JGGroupPanel = convertJGGroupPanel1;
controlDefines.JGSpacer = JGSpacer1;
controlDefines.JGGroupPanel = JGGroupPanel1;


const windowObjs = {{@ windowJsonScript}};

const render = function(controls: Array<Control>,contianerReact: ControlReact): JSX.Element|null{
    controls = layoutControls(controls,contianerReact,controlDefines);
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
    const router = useRouter();
    return (
        <React.Fragment>
            {convert(windowObjs,render,{router})}
        </React.Fragment>   
    );
}

export default Index;