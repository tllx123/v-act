const chalk = require("chalk");

const ChoiceDetailStatus = {
    Unload : 0,
    Loading: 1,
    Loaded : 2,
    Error : 3
}

class ChoiceDetail{

    constructor(query,value,waitingMsg){
        this.query = query;
        this.value = value;
        this.detail = '';
        this.waitingMsg = waitingMsg||'loading';
        this.maxLoadingDot = 8;
        this.currentLoadingDot = 1;
        this.prefix = '      ';
        this.status = ChoiceDetailStatus.Unload;
    }

    getDisplayValue(){
        if(this.status === ChoiceDetailStatus.Unload){
            return '';
        }
        const script = [this.prefix];
        if(this.status === ChoiceDetailStatus.Loading){
            let loadingText = this.getLoadingDisplayText();
            loadingText = chalk.hex('#999')(loadingText);
            script.push(loadingText);
        }else if(this.status === ChoiceDetailStatus.Loaded || this.status === ChoiceDetailStatus.Error){
            script.push(this.detail);
        }
        script.push('\n');
        return script.join('');
    }

    getLoadingDisplayText(){
        const script = [this.waitingMsg];
        let loadingDotCount = this.getLoadingDot();
        while((loadingDotCount--)>0){
            script.push('.');
        }
        return script.join('');
    }

    getLoadingDot(){
        if(this.currentLoadingDot>this.maxLoadingDot){
            this.currentLoadingDot = 1;
        }
        return this.currentLoadingDot++;
    }

    markToLoad(){
        return new Promise((resolve)=>{
            if(this.status == ChoiceDetailStatus.Unload || this.status == ChoiceDetailStatus.Error){
                if(this.query){
                    const promise = this.query(this.value);
                    this.status = ChoiceDetailStatus.Loading;
                    promise.then(detail=>{
                        this.detail = detail;
                        this.status = ChoiceDetailStatus.Loaded;
                        resolve();
                    }).catch(err=>{
                        this.status = ChoiceDetailStatus.Error;
                        this.detail = err.message;
                        resolve();
                    });
                }else{
                    resolve();
                }
            }
        });
    }

    markUnload(){
        this.status = ChoiceDetailStatus.Unload;
    }

    isError(){
        return this.status === ChoiceDetailStatus.Error;
    }

    shouldIntervalRender(){
        return this.status == ChoiceDetailStatus.Loading;
    }

}

module.exports = ChoiceDetail;