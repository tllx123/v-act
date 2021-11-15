const inquirer = require("inquirer");
const configUtils = require("./utils/configUtils.js");
/**
 * 获取可以选择的项目类型信息
*/
const projectTypes = configUtils.get("ProjectTypes");
/**
 * 问题列表
*/
const questions = [{
    "name": "ProjectType",
    "type": "list",
    "message": "请选择项目类型：",
    "choices":Object.values(projectTypes),
    "filter":(val)=>{
        //根据value查key
        const type = Object.keys(projectTypes).find(k => (projectTypes[k] === val));
        return type;
    }
},{
    "name": "ProjectName",
    "type": "input",
    "message": "请输入项目编码：",
    "default": "demo"
}];
module.exports = {
    /**
     * 问题入口
     * @returns 
    */
    init() {
        const promise = new Promise(async (resolve, reject) => {
            try {
                const askQuestions = async () => {
                    return inquirer.prompt(questions);
                }
                const answers = await askQuestions();
                const { ProjectName, ProjectType } = answers;
                resolve({
                    "projectType":ProjectType,
                    "projectName":ProjectName
                });
            } catch (error) {
                reject(error);
            }
        });
        return promise;
    }
}