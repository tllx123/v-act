import Const from "./const/Const";
import * as needle from "needle";
import {String} from "@v-act/utils";

const checkTaskNo = function(account: string,pwd: string,taskNo: string): Promise<{}>{
    return new Promise((resolve:(var1: {})=>void,reject:(var1: any)=>void)=>{
        const url = (Const.VTEAM_HOST.endsWith('/') ? Const.VTEAM_HOST:Const.VTEAM_HOST+"/") + (Const.VTEAM_CHECK_TASK_BELONG.startsWith("/") ? Const.VTEAM_CHECK_TASK_BELONG.substring(1):Const.VTEAM_CHECK_TASK_BELONG);
        needle.post(url,{
            taskCode: taskNo,
            memberAccount: account
        },{
            timeout: 5000
        },(err, resp, body)=>{
            if(err){
                return reject(err);
            }
            if(body.success){
                const data = body.data;
                if(data.isSuccess){
                    if(data.isBelonged){
                        resolve(data.vteam_task[0]);
                    }else{
                        reject(Error(`VTeam单号传递有误！详情：该单号不属于指定执行人，单号：${taskNo}，账号：${account}`));
                    }
                }else{
                    return reject(Error(data.msg)); 
                }
            }else{
                return reject(Error(body.msg));
            }
        }); 
    });
}

const getEnterpriseInfo = function(projectId: string): Promise<{code: string, name: string}>{
    return new Promise((resolve: (var1:{code: string, name: string})=>void,reject: (var1: any)=> void)=>{
        const url = (Const.VTEAM_HOST.endsWith('/') ? Const.VTEAM_HOST:Const.VTEAM_HOST+"/") + (Const.VTEAM_GET_ENTERPRISE_INFO.startsWith("/") ? Const.VTEAM_GET_ENTERPRISE_INFO.substring(1):Const.VTEAM_GET_ENTERPRISE_INFO);
        needle.post(url, {
            "projectId": projectId
        }, {
            timeout: 5000
        }, (err, res, body) => {
            if (err) {
                return reject(err);
            }
            if (body.success) {
                let data = body.data;
                if (data.isSuccess) {
                    let queryenterpriseinfo = data.queryenterpriseinfo;
                    if(queryenterpriseinfo&&queryenterpriseinfo.length>0){
                        resolve({
                            code : queryenterpriseinfo[0].code,
                            name : queryenterpriseinfo[0].name
                        });
                    }else{
                        reject(Error("未找到指定企业信息！项目id："+projectId));
                    }
                } else {
                    reject(Error(data.msg));
                }
            } else {
                reject(Error(body.message));
            }
        });
    });
}

const getProjectsByAccount = function(account: string,pwd: string): Promise<Array<{libCode:string}>>{
    return new Promise((resolve,reject)=>{
        const url = (Const.VTEAM_HOST.endsWith('/') ? Const.VTEAM_HOST:Const.VTEAM_HOST+"/") + (Const.VTEAM_GET_PROJECTS.startsWith("/") ? Const.VTEAM_GET_PROJECTS.substring(1):Const.VTEAM_GET_PROJECTS);
        needle.post(url, {
            acc: account,
            pwd: String.toBASE64(pwd,"hex")
        }, {
            timeout: 5000
        }, (err, res, body) => {
            if (err) {
                return reject(err);
            }
            if (body.success) {
                let data = body.data;
                let vteam_project:Array<any> = data.vteam_project;
                if(vteam_project&&vteam_project.length>0){
                    const projects:Array<{libCode:string}> = [];
                    vteam_project.forEach(project => {
                        if(project.libCode){
                            projects.push({
                                libCode: project.libCode
                            });
                        }
                    });
                    resolve(projects);
                }else{
                    reject(Error("未找到项目信息！账号："+ account));
                }
            } else {
                reject(Error(body.message));
            }
        });
    });
}

const getProjectInfo = function(projectId: string): Promise<{code: string,name: string,libCode: string}>{
    return new Promise((resolve,reject)=>{
        const url = (Const.VTEAM_HOST.endsWith('/') ? Const.VTEAM_HOST:Const.VTEAM_HOST+"/") + (Const.VTEAM_GET_PROJECT_INFO.startsWith("/") ? Const.VTEAM_GET_PROJECT_INFO.substring(1):Const.VTEAM_GET_PROJECT_INFO);
        needle.post(url, {
            "projectId": projectId
        }, {
            timeout: 5000
        }, (err, res, body) => {
            if (err) {
                return reject(err);
            }
            if (body.success) {
                let data = body.data;
                let vteam_project = data.vteam_project;
                if(vteam_project&&vteam_project.length>0){
                    resolve({
                        code : vteam_project[0].code,
                        name : vteam_project[0].name,
                        libCode: vteam_project[0].projectStoreCode
                    });
                }else{
                    reject(Error("未找到指定项目信息！项目id："+projectId));
                }
            } else {
                reject(Error(body.message));
            }
        });
    });
}

/**
 * 添加信息到vteam
 * @param {Object} data 
 * {
 *      symbolicName : "",//构件名称
 *      version : "",//构件版本
 *      taskIds:[]//任务id集合 
 * }
 */
const addInfoToVteam = function (account: string, data: {symbolicName: string,version: string,taskIds: Array<string>}): Promise<void> {
    return new Promise((resolve, reject) => {
        const url = (Const.VTEAM_HOST.endsWith('/') ? Const.VTEAM_HOST:Const.VTEAM_HOST+"/") + (Const.VTEAM_TASK_REF_URL.startsWith("/") ? Const.VTEAM_TASK_REF_URL.substring(1):Const.VTEAM_TASK_REF_URL);
        let taskRefEntities:{
            memberCode: string,
            taskId: string,
            componentCode: string,
            componentVersion: string
        }[] = [];
        let taskIds = data.taskIds;
        for (let i = 0, l = taskIds.length; i < l; i++) {
            let taskId = taskIds[i];
            taskRefEntities.push({
                "memberCode": account,
                "taskId": taskId,
                "componentCode": data.symbolicName,
                "componentVersion": data.version
            });
        }
        needle.post(url, {
            "vteam_task_rel_component_log": JSON.stringify(taskRefEntities)
        }, {
            timeout: 5000
        }, (err, res, body) => {
            if (err) {
                return reject(err);
            }
            if (body.success) {
                let data = body.data;
                if (data.success) {
                    resolve();
                } else {
                    return reject(Error(data.message));
                }
            } else {
                return reject(Error(body.msg));
            }
        });
    });
}

export default {

    checkTaskNo,

    getProjectInfo,

    getProjectsByAccount,

    getEnterpriseInfo,

    addInfoToVteam

}