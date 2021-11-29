const observe = require("inquirer/lib/utils/events");
const {flatMap,map,take,takeUntil} = require('rxjs/operators');
const runAsync = require('run-async');
const ChoiceItem = require('./ChoiceItem');
const Paginator = require('inquirer/lib/utils/paginator');
const chalk = require("chalk");
const isNumber = require('lodash/isNumber');

class ChoicePanel{

    constructor(opt,rl,screen){
        this.intervalIndex = null;
        this.interval = 500;
        this.screen = screen;
        this.rl = rl;
        this.opt = opt;
        if (!this.opt.choices) {
            throw new Error('You must provide a choices parameter');
        }
        this.isSubmit = false;
        this.choiceItems = this._initChoiceItems(this.opt.choices);
        const items = this._getCanSelectItems();
        if(items.length == 0){
            throw new Error('You must provide a choices parameter');
        }
        this._selectChoiceOnInit();
        const shouldLoop = this.opt.loop === undefined ? true : this.opt.loop;
        this.paginator = new Paginator(this.screen, {
            isInfinite: shouldLoop
        });
        this._bind();
    }

    _selectChoiceOnInit(){
        const items = this._getCanSelectItems();
        let def = this.opt.default;
        if (isNumber(def) && def >= 0 && def < items.length) {
            items[def].markSelected();
            return;
        } else if (!isNumber(def) && def != null) {
            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                if(item.getValue() === def){
                    item.markSelected();
                    return;
                }
            }
        }
        items[0].markSelected();
    }

    _initChoiceItems(){
        const choiceItems = [];
        this.opt.choices.forEach(choice=>{
            choiceItems.push(new ChoiceItem(choice,this.opt.query,this.opt.waitingMsg));
        });
        return choiceItems;
    }

    _bind(){
        const self = this;
        const events = observe(this.rl);
        events.normalizedUpKey.pipe(takeUntil(events.line)).forEach(this.onUpKey.bind(this));
        events.normalizedDownKey.pipe(takeUntil(events.line)).forEach(this.onDownKey.bind(this));
        events.numberKey.pipe(takeUntil(events.line)).forEach(this.onNumberKey.bind(this));
        events.line.pipe(take(1), map(this._getCurrentValue.bind(this)), flatMap((value) =>
            runAsync(self.opt.filter)(value, self.answers).catch((err) => err)
        )).forEach(this.onSubmit.bind(this));
        events.keypress.forEach(({key}) => {
            switch (key.name) {
                case "left":
                    return this.onLeftKey();

                case "right":
                    return this.onRightKey();
            }
        });
    }

    _getCurrentValue() {
        const item = this._getCurrentChoiceItem();
        return item ? item.getValue():null;
    }

    _getCurrentChoiceItem(){
        for (let index = 0; index < this.choiceItems.length; index++) {
            const item = this.choiceItems[index];
            if(item.isSelected()){
                return item;
            }
        }
        return null;
    }

    onSubmit(value) {
        this.isSubmit = true;
        if(this.intervalIndex != null){
            clearInterval(this.intervalIndex);
            this.intervalIndex = null;
        }
        this.render();
        this.screen.done();
        if(this.done){
            this.done(value);
        }
    }

    _setChoiceItemSelected(index){
        let separatorOffset = 0;
        this.choiceItems.forEach((item, i) => {
            if (item.isSeparator()) {
                separatorOffset++;
                return;
            }
            if (item.isDisabled()) {
                separatorOffset++;
                return;
            }
            const isSelected = i - separatorOffset === index;
            if(isSelected){
                item.markSelected();
            }else{
                item.markUnselected();
            }
        });
    }

    _isSelectLoop(){
        return 'loop' in this.opt ? Boolean(this.opt.loop) : true;
    }

    _getCanSelectItems(){
        const items = [];
        this.choiceItems.forEach(item=>{
            if(!item.isSeparator()&&!item.isDisabled()){
                items.push(item);
            }
        });
        return items;
    }

    _getPreCanSelectItem(current){
        const items = this._getCanSelectItems();
        let index = items.indexOf(current);
        if(index === 0 ){
            if(this._isSelectLoop()){
                index = items.length -1;
            }
        }else{
            index--;
        }
        return items[index];
    }

    _getNextCanSelectItem(current){
        const items = this._getCanSelectItems();
        let index = items.indexOf(current);
        if(index === items.length-1 ){
            if(this._isSelectLoop()){
                index = 0;
            }
        }else{
            index++;
        }
        return items[index];
    }

    onUpKey() {
        const current = this._getCurrentChoiceItem();
        const pre = this._getPreCanSelectItem(current);
        if(current !== pre){
            current.markUnselected();
            pre.markSelected();
            this.render();
        }
    }

    onDownKey() {
        const current = this._getCurrentChoiceItem();
        const next = this._getNextCanSelectItem(current);
        if(current !== next){
            current.markUnselected();
            next.markSelected();
            this.render();
        }
    }

    onNumberKey(input) {
        const items = this._getCanSelectItems();
        if(input >= 0 && input <= items.length){
            items[input].markSelected();
            this.render();
        }
    }

    onLeftKey() {
        const item = this._getCurrentChoiceItem();
        if(item){
            item.markCollapse();
        }
        this._stopIntervalRender();
        this.render();
    }

    onRightKey() {
        const item = this._getCurrentChoiceItem();
        if(item){
            const promise = item.markExpand();
            promise.then(()=>{
                this._stopIntervalRender();
                this.render();
            });
        }
        this._startIntervalRender();
        this.render();
    }

    markSubmit(){
        this.isSubmit = true;
    }

    _startIntervalRender(){
        if(this.intervalIndex === null){
            const items = this._getCanSelectItems();
            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                if(item.shouldIntervalRender()){
                    this._intervalRender();
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    _stopIntervalRender(){
        if(this.intervalIndex !== null){
            const items = this._getCanSelectItems();
            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                if(item.shouldIntervalRender()){
                    return false;
                }
            }
            clearInterval(this.intervalIndex);
            this.intervalIndex = null;
        }
        return true;
    }

    _intervalRender(){
        this.intervalIndex = setInterval(()=>{
            this.render();
        },this.interval);
    }

    render(){
        const message = [this.opt.message];
        message.push(chalk.dim('(Use arrow keys)'));
        if (this.isSubmit) {
            message.push(chalk.cyan(this._getCurrentChoiceItem().getShort()));
        } else {
            message.push('\n');
            const choicesStr = [];
            this.choiceItems.forEach(item=>{
                choicesStr.push(item.getDisplayText());
            });
            /*let indexPosition = -1;
            for (let index = 0; index < this.choiceItems.length; index++) {
                const item = this.choiceItems[index];
                if(item.isSelected()){
                    indexPosition = index;
                    break;
                }
            }
            const realIndexPosition = this.opt.choices.reduce((acc, value, i) => {
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
            message.push(this.paginator.paginate(choicesStr.join(''), realIndexPosition, this.opt.pageSize));*/
            if(isNumber(this.opt.pageSize)){
                let realIndex = 0;
                let pageSize = 0;
                for (let index = 0; index < this.choiceItems.length; index++) {
                    const item = this.choiceItems[index];
                    if(item.isSelected()){
                        break;
                    }
                    if (item.isSeparator()) {
                        realIndex++;
                    }else{
                        let name = item.getName();
                        if (typeof name !== 'string') {
                            realIndex++;
                        }else{
                            const names = name.split('\n');
                            realIndex += names.length;
                        }
                    }
                }
                message.push(this.paginator.paginate(choicesStr.join(''), realIndex, this.opt.pageSize));
            }else{
                message.push(choicesStr.join(''));
            }
            
        }
        this.screen.render(message.join(''));
    }

    getResult(){
        return new Promise((resolve,reject)=>{
            this.done = resolve;
            this.error = reject;
        });
    }
}
module.exports = ChoicePanel;