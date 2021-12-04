const inquirer = require('inquirer');
inquirer.registerPrompt('detailList', require('@v-act/inquirer-detail-list'));

export const  chooseInstallType =async function():Promise<any>{
     let  val
     await  inquirer.prompt([{
            type: 'list',
            message: '检索到你同时使用了yarn和npm，请选择一种方式安装依赖：',
            choices: ['yarn','npm'],
            name: 'selectInstallType'
        }]).then(answers => {
            const selected = answers.selectInstallType
            val = selected
        })
    
  return  val
}



export const  inputInstallType =async function():Promise<any>{
    let  val
     await  inquirer.prompt([{
        type: 'input',
        message: '未检测到你所使用的包管理工具,请手动输入你所使用的命令，例如：yarn/yarn add/npm install',
        name: 'inputInstallType'
    }]).then(answers => {
        const selected = answers.inputInstallType
        val = selected
    });
     
   return val
 }
 



