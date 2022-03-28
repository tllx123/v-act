import React,{useEffect} from 'react';
import { useRouter } from 'next/router';
import { useContext } from '@v-act/widget-context'
import dynamic from 'next/dynamic';
import {ScopeManager as scopeManager} from '@v-act/vjs.framework.extension.platform.interface.scope';
import {uuid} from '@v-act/vjs.framework.extension.util.uuid'
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

function Index(props:{instanceId:string}){
    parse();
    const router = useRouter();
    const stackInfo = useStackInfo();
        const {instanceId} = props;
    let windowScope = scopeManager.getScope(instanceId);
    if(!windowScope){
      scopeManager.createWindowScope({
        scopeId:instanceId,
        componentCode:"{{@ componentCode}}",
        windowCode:"{{@ windowCode}}",
        series:"smartclient"
      });
      windowScope = scopeManager.getScope(instanceId);
    }
    const context = useContext()
    const entityOperation = {
        "insert": context.insertDataFunc,
        "update": context.updateDataFunc,
        "remove": context.removeDataFunc,
        "clear": context.clearDataFunc,
    };    
    useEffect(()=>{
      const initVPlatformWin = async()=>{
        try{
          {{@ ruleImports}}
          {{@ funcImports}}
          const ruleDefines = {{@ ruleDefines}}
          const funcDefines = {{@ funcDefines}}
          const viewLib = (await import('@v-act/vjs.framework.extension.publish.window.render.smartclient.viewlib')).ViewLib
          scopeManager.getScope(instanceId).set('__vplatformWinInited', true)
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
                  params:{
                    componentCode: string,
                    windowCode: string,
                    title: string,
                    param: { [code: string]: any },
                    rendered:(scopeId:string)=>void,
                    closed:(...args:any[])=>any
                  }
                ) => {
                  const {componentCode,windowCode,title,param,rendered,closed} = params;
                  const callbackId = "__dialog_win_close_cb_"+(thisLevel + 1);
                  const renderedCallbackId = "__dialog_win_rendered_cb_"+(thisLevel + 1);
                  window[callbackId] = (...args:any[])=>{
                    try{
                      if(typeof closed == 'function'){
                        closed(...args);
                      }
                    }finally{
                      delete window[callbackId];
                    }
                  }
                  window[renderedCallbackId] = (scopeId)=>{
                    try{
                      if(typeof rendered == 'function'){
                        rendered(scopeId);
                      }
                    }finally{
                      delete window[renderedCallbackId];
                    }
                  }
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
              windowScope.set('dailogWindowCloseHandler',(...args:any[])=>{
                const closeHandlerId = "__dialog_win_close_handler_"+thisLevel;
                const handler = window[closeHandlerId]
                if(handler){
                  try{
                    handler(...args);
                  }finally{
                    delete window[closeHandlerId]
                  }
                }
              })
              if(router.query){
                let modal = router.query.modal
                const rendercb = window["__dialog_win_rendered_cb_"+modal];
                if(rendercb){
                  try{
                    rendercb(scopeId)
                  }finally{
                    delete window["__dialog_win_rendered_cb_"+modal];
                  }
                }
              }
            }
          });
        }catch(e){
          console.error(e);
        }
      }
      const winScope = scopeManager.getScope(instanceId);
      const key = "__vplatformWinIniting";
      const initing = winScope.get(key);
      if(!initing){
        winScope.set(key,true);
        initVPlatformWin();
      }
      return ()=>{
        if (scopeManager.getScope(instanceId).get('__vplatformWinInited')) {
          scopeManager.destroy(instanceId)
        }
      }
    });
    return (
        <React.Fragment>
            {parseWindowSchema({
              instanceId,
              componentCode:"{{@ componentCode}}",
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