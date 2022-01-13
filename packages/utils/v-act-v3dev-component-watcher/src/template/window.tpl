import React from 'react';
import { useRouter } from 'next/router';
import useStackInfo from '../../../src/components/usePageStackInfo';
import {convertWindowSchema} from "@v-act/widget-utils";
import {JGComponent as JGComponent1,convert as convertJGComponent} from "@v-act/jgcomponent";
import {JGSpacer as JGSpacer1,convert as convertJGSpacer1} from "@v-act/jgspacer";
import {JGGroupPanel as JGGroupPanel1,convert as convertJGGroupPanel1} from "@v-act/jggrouppanel";
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
widgetDefines.JGSpacer = JGSpacer1;
widgetDefines.JGGroupPanel = JGGroupPanel1;
widgetDefines.JGComponent = JGComponent1;

const windowObjs = {{@ windowJsonScript}};

function Index(){
    const router = useRouter();
    const stackInfo = useStackInfo();
    return (
        <React.Fragment>
            {convertWindowSchema(windowObjs,widgetDefines,widgetConverts,{router,stackInfo})}
        </React.Fragment>   
    );
}

export default Index;