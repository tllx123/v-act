import React,{useEffect} from 'react';
import { useRouter } from 'next/router';
import { useContext } from '@v-act/widget-context'
import dynamic from 'next/dynamic';
import {ScopeManager as scopeManager} from '@v-act/vjs.framework.extension.platform.interface.scope';
import {uuid} from '@v-act/vjs.framework.extension.util.uuid'
import useStackInfo from '../../../src/components/usePageStackInfo';
import {parse,returnComponentSchema} from '../../../src/componentdefs/{{@ componentCode}}';
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

function Index(props:{instanceId:string}){
    parse();
    const componentSchema = returnComponentSchema()
    const router = useRouter();
    const stackInfo = useStackInfo();
    const {instanceId} = props;
    const componentCode = "{{@ componentCode}}";
    const windowCode = "{{@ windowCode}}";
    let windowScope = scopeManager.getScope(instanceId);
    if(!windowScope){
      scopeManager.createWindowScope({
        scopeId:instanceId,
        componentCode,
        windowCode,
        series:"smartclient"
      });
      windowScope = scopeManager.getScope(instanceId);
    }
    const context = useContext()   
    useEffect(()=>{
      const initVPlatformWin = async()=>{
        try{
          {{@ ruleImports}}
          {{@ funcImports}}
          const ruleDefines = {{@ ruleDefines}}
          const funcDefines = {{@ funcDefines}}
          const init = (await import('@v-act/vjs.framework.extension.platform.init')).init
          init({
            componentCode,
            windowCode,
            ruleDefines,
            funcDefines,
            widgetDefines,
            context,
            winJson:windowObjs,
            router,
            stackInfo,
            scopeId:instanceId,
            componentSchema
          });
          scopeManager.getScope(instanceId).markInited();
        }catch(e){
          console.error(e);
        }
      }
      const winScope = scopeManager.getScope(instanceId);
      if(!winScope.isIniting()){
        winScope.markIniting();
        initVPlatformWin();
      }
      return ()=>{
        if (scopeManager.getScope(instanceId).isInited()) {
          scopeManager.destroy(instanceId)
        }
      }
    });
    return (
        <React.Fragment>
            {parseWindowSchema({
              instanceId,
              componentCode,
              windowSchema: windowObjs,
              widgetDefines,
              windowScope,
              context: {router,stackInfo}
            })}
        </React.Fragment>   
    );
}

export async function getStaticProps() {
  return {
    props: {
      instanceId: (()=>uuid.generate())()
    }
  }
}
export default Index;