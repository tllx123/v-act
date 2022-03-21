import React,{useEffect} from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import {ScopeManager as scopeManager} from '@v-act/vjs.framework.extension.platform.interface.scope';
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

const _getRandomNum = function () {
  const random = Math.random() * 10000
  return parseInt(random + '')
}

function Index(){
    parse();
    const router = useRouter();
    const stackInfo = useStackInfo();
    const context = useContext()
    const entityOperation = {
        "insert": context.insertDataFunc,
        "update": context.updateDataFunc,
        "remove": context.removeDataFunc,
        "clear": context.clearDataFunc,
    };
    const instanceId = scopeManager.createWindowScope({componentCode:"{{@ componentCode}}",windowCode:"{{@ windowCode}}",series:"smartclient"});
    useEffect(async ()=>{
      try{
        debugger
        {{@ ruleImports}}
        {{@ funcImports}}
        const ruleDefines = {{@ ruleDefines}}
        const funcDefines = {{@ funcDefines}}
        const viewLib = (await import('@v-act/vjs.framework.extension.publish.window.render.smartclient.viewlib')).ViewLib
        viewLib.init({
          "paramCfg": {
            "skinType": "default",
            "runningMode": "test",
            "debug": false,
            "debugPort": "",
            "devId": "",
            "contextPath": "",
            "refComponents": {},
            "showChromePlugin": false
          },
          "languageCode": "",
          "scopeId":instanceId,
          "componentCode": "{{@ componentCode}}",
          "windowCode": "{{@ windowCode}}",
          "componentPackMappingDatas": {},
          "envirmentContext": {
            "optimizeLink": true,
            "isEncryptToken": false,
            "ExceptionInstanceIden": "vxl0b2bdLP7aSIRoZJlf1Q__",
            "CompatibleMode": true
          },
          "inputParam": {
            "variable": {
              "windowCode": "{{@ windowCode}}",
              "componentCode": "{{@ componentCode}}",
              "workspaceKey": "",
            }
          },
          winDatas:windowObjs,
          rendered:(scopeId)=>{
            const scope = scopeManager.getScope(scopeId);
            scope.set("ruleDefines",ruleDefines);
            scope.set("funcDefines",funcDefines);
            const { thisLevel } = stackInfo
            const windowScope = scopeManager.getWindowScope()
            windowScope.set(
              'dialogWindowHandler',
              (
                componentCode: string,
                windowCode: string,
                title: string,
                param: { [code: string]: any }
              ) => {
                router.push({
                  pathname: `/${componentCode}/${windowCode}`,
                  query: {
                    modal: thisLevel + 1,
                    title: title ? title : '',
                    v: _getRandomNum()
                  }
                })
              }
            )
            windowScope.set(
              'currentWindowHandler',
              (
                componentCode: string,
                windowCode: string,
                title: string,
                param: { [code: string]: any }
              ) => {
                router.push({
                  pathname: `/${componentCode}/${windowCode}`,
                  query: {
                    modal: thisLevel,
                    title: title ? title : '',
                    v: _getRandomNum()
                  }
                })
              }
            )
            windowScope.set('dataSourceHandler',entityOperation)
          }
        });
      }catch(e){
        console.error(e);
      }
    });
    return (
        <React.Fragment>
            {parseWindowSchema({
              instanceId,
              componentCode:"{{@ componentCode}}",
              windowSchema: windowObjs,
              widgetDefines,
              context: {router,stackInfo}
            })}
        </React.Fragment>   
    );
}

export default Index;