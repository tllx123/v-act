const inquirer = require("inquirer");

inquirer.registerPrompt("detailList", require("../index"));

const details = {
    npm: 'some npm details',
    yarn: 'some yarn details',
    jspm: 'some jspm details'
};

inquirer
  .prompt([
    {
      type: "detailList",
      name: "workoutPlan",
      message: "Choose your workout plan for next week",
      choices:  ['npm','yarn',{type:'separator'},'jspm'],
      query:function(val){
          return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve(details[val]);
            },3000);
          });
      }
    }
  ])
  .then(answers => {
    console.log(answers);
  });