const cliCursor = require('cli-cursor');
const Base = require("inquirer/lib/prompts/base");
const ChoicePanel = require("./ChoicePanel");

class DetailList extends Base {

    constructor(questions, rl, answers) {
        super(questions, rl, answers);
        this.choicePanel = new ChoicePanel(this.opt,rl,this.screen);
    }

    /**
     * Start the inquirer session
     *
     * @param  {Function} callback
     * @return {TablePrompt}
     */
    _run(callback) {
        const promise = this.choicePanel.getResult();
        promise.then(result=>{
            cliCursor.show();
            callback(result);
        });
        cliCursor.hide();
        this.choicePanel.render();
        return this;
    }

}

module.exports = DetailList;