const chalk = require("chalk");
const isNumber = require('lodash/isNumber');
const findIndex = require('lodash/findIndex');
const isString = require('lodash/isString');
const runAsync = require('run-async');
const cliCursor = require('cli-cursor');
const {
    flatMap,
    map,
    take,
    takeUntil
} = require('rxjs/operators');
const figures = require('figures');
const Base = require("inquirer/lib/prompts/base");
const observe = require("inquirer/lib/utils/events");
const Paginator = require('inquirer/lib/utils/paginator');
const incrementListIndex = require('inquirer/lib/utils/incrementListIndex');
const DetailStatus = {
    UnLoaded:0,
    Loading:1,
    Loaded:2,
    Erorr:3
};
const maxLoadingDot = 6;

class DetailList extends Base {

    constructor(questions, rl, answers) {
        super(questions, rl, answers);
        if (!this.opt.choices) {
            this.throwParamError('choices');
        }
        this.firstRender = true;
        this.selected = 0;
        this.interval = 500;
        this.intervalIndex = null;
        this.waitingMsg = this.opt.waitingMsg||"loading";
        

        const def = this.opt.default;

        // If def is a Number, then use as index. Otherwise, check for value.
        if (isNumber(def) && def >= 0 && def < this.opt.choices.realLength) {
            this.selected = def;
        } else if (!isNumber(def) && def != null) {
            const index = findIndex(
                this.opt.choices.realChoices,
                ({
                    value
                }) => value === def
            );
            this.selected = Math.max(index, 0);
        }

        // Make sure no default is set (so it won't be printed)
        this.opt.default = null;
        this.details = this.opt.details||{};
        this.detailExpended = {};
        this.detailStatus = {};
        this._initDefaultStatus();
        const shouldLoop = this.opt.loop === undefined ? true : this.opt.loop;
        this.paginator = new Paginator(this.screen, {
            isInfinite: shouldLoop
        });
    }

    _initDefaultStatus(){
        this.opt.choices.forEach((choice)=>{
            this.detailStatus[choice.value] = DetailStatus.UnLoaded;
        });
    }

    _getLoadingDot(){
        let currentLoadingDot = this.currentLoadingDot||1;
        this.currentLoadingDot = currentLoadingDot+1;
        if(this.currentLoadingDot>maxLoadingDot){
            this.currentLoadingDot = currentLoadingDot = 1;
        }
        const script = [];
        for (let index = 0; index < currentLoadingDot; index++) {
            script.push('.');
        }
        return script.join('');
    }

    _resetLoadingDot(){
        this.currentLoadingDot = 1;
    }

    /**
     * Start the inquirer session
     *
     * @param  {Function} callback
     * @return {TablePrompt}
     */
    _run(callback) {
        this.done = callback;
        const self = this;
        const events = observe(this.rl);
        events.normalizedUpKey.pipe(takeUntil(events.line)).forEach(this.onUpKey.bind(this));
        events.normalizedDownKey.pipe(takeUntil(events.line)).forEach(this.onDownKey.bind(this));
        events.numberKey.pipe(takeUntil(events.line)).forEach(this.onNumberKey.bind(this));
        events.line.pipe(take(1), map(this.getCurrentValue.bind(this)), flatMap((value) =>
            runAsync(self.opt.filter)(value, self.answers).catch((err) => err)
        )).forEach(this.onSubmit.bind(this));
        events.keypress.forEach(({
            key
        }) => {
            switch (key.name) {
                case "left":
                    return this.onLeftKey();

                case "right":
                    return this.onRightKey();
            }
        });
        // Init the prompt
        cliCursor.hide();
        this.render();
        return this;
    }

    _startIntervalRender(){
        if(this.intervalIndex === null){
            //开始循环渲染条件：详细信息存在展开，详细信息正在加载
            for (const choice in this.detailExpended) {
                if (Object.hasOwnProperty.call(this.detailExpended, choice)) {
                    if(this.detailExpended[choice]){
                        for (const choice in this.detailStatus) {
                            if (Object.hasOwnProperty.call(this.detailStatus, choice)) {
                                if(this.detailStatus[choice] === DetailStatus.Loading){
                                    this._intervalRender();
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    _stopIntervalRender(){
        if(this.intervalIndex !== null){
            //循环渲染终止条件：详细信息都折叠或详细信息都已加载或报错
            let shouldStop = true,allColls = true;
            for (const choice in this.detailExpended) {
                if (Object.hasOwnProperty.call(this.detailExpended, choice)) {
                    if(this.detailExpended[choice]){
                        allColls = false;
                        break;
                    }
                }
            }
            if(!allColls){
                for (const choice in this.detailStatus) {
                    if (Object.hasOwnProperty.call(this.detailStatus, choice)) {
                        if(this.detailStatus[choice] === DetailStatus.Loading){
                            shouldStop = false;
                            break;
                        }
                    }
                }
            }
            if(shouldStop){
                this._resetLoadingDot();
                clearInterval(this.intervalIndex);
                this.intervalIndex = null;
            }
            
        }
    }

    _intervalRender(){
        this.intervalIndex = setInterval(()=>{
            this.render();
        },this.interval);
    }

    onSubmit(value) {
        this.status = 'answered';
        this.render();
        this.screen.done();
        cliCursor.show();
        this.done(value);
    }

    getCurrentValue() {
        return this.opt.choices.getChoice(this.selected).value;
    }

    onUpKey() {
        this.selected = incrementListIndex(this.selected, 'up', this.opt);
        this.render();
    }

    onDownKey() {
        this.selected = incrementListIndex(this.selected, 'down', this.opt);
        this.render();
    }

    onNumberKey(input) {
        if (input <= this.opt.choices.realLength) {
            this.selected = input - 1;
        }
        this.render();
    }

    onLeftKey() {
        const current = this.getCurrentValue();
        this.detailExpended[current] = false;
        this.render();
        this._stopIntervalRender();
    }

    onRightKey() {
        const current = this.getCurrentValue();
        this.detailExpended[current] = true;
        if(this.details[current]){
            this.render();
        }else{
            const query = this.opt.query;
            if(query){
                this.detailStatus[current] = DetailStatus.Loading;
                this._startIntervalRender();
                try{
                    const promise = query(current);
                    promise.then((detail)=>{
                        this.details[current] = detail;
                        this.detailStatus[current] = DetailStatus.Loaded;
                        this.render();
                        this._stopIntervalRender();
                    }).catch(err=>{
                        this.details[current] = err.message;
                        this.detailStatus[current] = DetailStatus.Erorr;
                        this.render();
                        this._stopIntervalRender();
                    });
                }catch(e){
                    this._stopIntervalRender();
                }
            }
        }
    }

    render() {
        let message = this.getQuestion();
        if (this.firstRender) {
            message += chalk.dim('(Use arrow keys)');
        }
        if (this.status === 'answered') {
            message += chalk.cyan(this.opt.choices.getChoice(this.selected).short);
        } else {
            const choicesStr = this.listRender(this.opt.choices, this.selected);
            const indexPosition = this.opt.choices.indexOf(
                this.opt.choices.getChoice(this.selected)
            );
            const realIndexPosition =
                this.opt.choices.reduce((acc, value, i) => {
                    if (i > indexPosition) {
                        return acc;
                    }
                    if (value.type === 'separator') {
                        return acc + 1;
                    }

                    let l = value.name;
                    if (typeof l !== 'string') {
                        return acc + 1;
                    }
                    l = l.split('\n');
                    return acc + l.length;
                }, 0) - 1;
            message +=
                '\n' + this.paginator.paginate(choicesStr, realIndexPosition, this.opt.pageSize);
        }
        this.firstRender = false;
        this.screen.render(message);
    }

    listRender(choices, pointer) {
        let output = '';
        let separatorOffset = 0;

        choices.forEach((choice, i) => {
            if (choice.type === 'separator') {
                separatorOffset++;
                output += '  ' + choice + '\n';
                return;
            }

            if (choice.disabled) {
                separatorOffset++;
                output += '  - ' + choice.name;
                output += ' (' + (isString(choice.disabled) ? choice.disabled : 'Disabled') + ')';
                output += '\n';
                return;
            }

            const isSelected = i - separatorOffset === pointer;
            let line = (isSelected ? figures.pointer + ' ' : '  ') + choice.name;
            if (isSelected) {
                line = chalk.cyan(line);
            }

            output += line + ' \n';

            output += this._getDisplayDetail(choice.value);
        });

        return output.replace(/\n$/, '');
    }

    _getDisplayDetail(choice){
        let output = '';
        if(this.detailExpended[choice]){
            const choiceStatus = this.detailStatus[choice];
            const prefix = '      ';
            if(choiceStatus === DetailStatus.Loading){
                output += prefix;
                output += this.waitingMsg;
                output += this._getLoadingDot();
                output += ' \n';
            }else if(choiceStatus === DetailStatus.Loaded || choiceStatus === DetailStatus.Error){
                output += prefix;
                output += this.details[choice];
                output += ' \n';
            }
        }
        return output;
    }

}

module.exports = DetailList;