import React from 'react';
import { useRouter } from 'next/router';
import useStackInfo from '../../../src/components/usePageStackInfo';
import {parse} from '../../../src/componentdefs/{{@ componentCode}}';
import {convertWindowSchema} from "@v-act/window-schema-utils";
import {JGComponent as JGComponent1,convert as convertJGComponent} from "@v-act/jgcomponent";
import {JGSpacer as JGSpacer1,convert as convertJGSpacer1} from "@v-act/jgspacer";
import {JGGroupPanel as JGGroupPanel1,convert as convertJGGroupPanel1} from "@v-act/jggrouppanel";
import {JGContext as JGContext1,convert as convertJGContext1} from "@v-act/jgcontext";
import {JGButtonGroup as JGButtonGroup1,convert as convertJGButtonGroup1} from '@v-act/jgbuttongroup';
import {JGCollapse,convert as convertJGCollapse} from '@v-act/jgcollapse'
{{@ importScripts}}

const widgetConverts: { [widgetType: string]: Function } = {{@ controlConvertMap}};
const widgetDefines: {
  [widgetType: string]: {
    defaultProps?:
      | {
          [pro: string]: any
        }
      | undefined
  }
} = {{@ controlDefines}};
widgetConverts.JGSpacer = convertJGSpacer1;
widgetConverts.JGGroupPanel = convertJGGroupPanel1;
widgetConverts.JGComponent = convertJGComponent;
widgetConverts.JGContext = convertJGContext1;
widgetConverts.JGButtonGroup = convertJGButtonGroup1;
widgetConverts.JGCollapse = convertJGCollapse;
widgetDefines.JGSpacer = JGSpacer1;
widgetDefines.JGGroupPanel = JGGroupPanel1;
widgetDefines.JGComponent = JGComponent1;
widgetDefines.JGContext = JGContext1;
widgetDefines.JGButtonGroup = JGButtonGroup1;
widgetDefines.JGCollapse = JGCollapse;

const windowObjs = {{@ windowJsonScript}};

function Index(){
    parse();
    const router = useRouter();
    const stackInfo = useStackInfo();
    return (
        <React.Fragment>
            {convertWindowSchema("{{@ componentCode}}",windowObjs,widgetDefines,widgetConverts,{router,stackInfo})}
        </React.Fragment>   
    );
}

export default Index;