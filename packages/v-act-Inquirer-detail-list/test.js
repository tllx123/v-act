const inquirer = require("inquirer");

inquirer.registerPrompt("detailList", require("./index"));

const details = {
    npm: 'some npm detailssome npm detailssome npm detailssome npm detailssome npm detailssome npm detailssome npm detailssome npm detailssome npm detailssome npm details',
    yarn: 'some yarn detailssome yarn detailssome yarn detailssome yarn detailssome yarn detailssome yarn detailssome yarn details',
    jspm: 'some jspm detailssome jspm detailssome jspm detailssome jspm detailssome jspm detailssome jspm detailssome jspm detailssome jspm details'
};

inquirer
  .prompt([
    {
      type: "detailList",
      name: "workoutPlan",
      message: "Choose your workout plan for next week",
      choices:  ['npm','yarn',{type:"separator"},'jspm'],
      query:function(val){
          return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve(details[val]);
            },10000);
          });
      }
    }
  ])
  .then(answers => {
    /*
    { workoutPlan:
      [ 'arms', 'legs', 'cardio', undefined, 'legs', 'arms', undefined ] }    
    */
    console.log(answers);
  });