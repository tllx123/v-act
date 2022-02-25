import React from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useStackInfo from '../../../src/components/usePageStackInfo';
import {parse} from '../../../src/componentdefs/{{@ componentCode}}';
import {parseWindowSchema} from "@v-act/window-schema-utils";
const JGComponent1 = dynamic(()=>{return import('@v-act/jgcomponent').then(mod=>mod.JsonJGComponent)});
const JGSpacer1 = dynamic(()=>{return import('@v-act/jgspacer').then(mod=>mod.JsonJGSpacer)});
const JGGroupPanel1 = dynamic(()=>{return import('@v-act/jggrouppanel').then(mod=>mod.JsonJGGroupPanel)});
const JGContext1 = dynamic(()=>{return import('@v-act/jgcontext').then(mod=>mod.JsonJGContext)});
const JGButtonGroup1 = dynamic(()=>{return import('@v-act/jgbuttongroup').then(mod=>mod.JsonJGButtonGroup)});
const JGCollapse1 = dynamic(()=>{return import('@v-act/jgcollapse').then(mod=>mod.JsonJGCollapse)});
{{@ importScripts}}

const widgetDefines: {
  [widgetType: string]: {
    defaultProps?:
      | {
          [pro: string]: any
        }
      | undefined
  }
} = {{@ controlDefines}};
widgetDefines.JGSpacer = JGSpacer1;
widgetDefines.JGGroupPanel = JGGroupPanel1;
widgetDefines.JGComponent = JGComponent1;
widgetDefines.JGContext = JGContext1;
widgetDefines.JGButtonGroup = JGButtonGroup1;
widgetDefines.JGCollapse = JGCollapse1;

const windowObjs = {{@ windowJsonScript}};

function Index(){
    parse();
    const router = useRouter();
    const stackInfo = useStackInfo();
    return (
        <React.Fragment>
            {parseWindowSchema("{{@ componentCode}}",windowObjs,widgetDefines,{router,stackInfo})}
        </React.Fragment>   
    );
}

export default Index;