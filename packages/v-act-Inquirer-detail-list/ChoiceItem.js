const ChoiceDetail = require("./ChoiceDetail");
const figures = require('figures');
const chalk = require("chalk");
const isString = require('lodash/isString');

const ChoiceItemStatus = {
    
    Collapse : 0,

    Expand : 1

}

class ChoiceItem{

    constructor(choice,query,waitingMsg){
        this.choice = choice;
        this.selected = false;
        this.status = ChoiceItemStatus.Collapse;
        this.choiceDetail = new ChoiceDetail(query,choice.value,waitingMsg);
    }

    markExpand(){
        return new Promise((resolve)=>{
            this.status = ChoiceItemStatus.Expand;
            const promise = this.choiceDetail.markToLoad();
            promise.then(()=>{
                resolve();
            }).catch(err=>{
                resolve();
            });
        });
    }
    isExpanded(){
        return this.status === ChoiceItemStatus.Expand;
    }

    markCollapse(){
        this.status = ChoiceItemStatus.Collapse;
    }

    isCollapsed(){
        return this.status === ChoiceItemStatus.Collapse;
    }

    isDisabled(){
        return !!this.choice.disabled;
    }

    isSelected(){
        return this.selected;
    }

    markSelected(){
        this.selected = true;
    }

    markUnselected(){
        this.selected = false;
    }

    getName(){
        return this.choice.name;
    }

    getValue(){
        return this.choice.value;
    }

    getShort(){
        return this.choice.short;
    }

    isSeparator(){
        return this.choice.type === 'separator';
    }

    shouldIntervalRender(){
        if(this.status === ChoiceItemStatus.Expand){
            return this.choiceDetail.shouldIntervalRender();
        }
        return false;
    }

    getDisplayText(){
        const script = [];
        if (this.choice.type === 'separator') {
            script.push('  ' + this.choice + '\n');
            return script.join('');
        }
        if (this.choice.disabled) {
            script.push('  - ' + this.choice.name);
            script.push(' (' + (isString(this.choice.disabled) ? this.choice.disabled : 'Disabled') + ')');
            script.push('\n');
            return script.join('');
        }
        let line = (this.selected ? figures.pointer + ' ' : '  ') + this.choice.name;
        if (this.selected) {
            line = chalk.cyan(line);
        }

        script.push(line + ' \n');
        if(this.status === ChoiceItemStatus.Expand){
            script.push(this.choiceDetail.getDisplayValue());
        }
        return script.join('');
    }

}

module.exports = ChoiceItem;