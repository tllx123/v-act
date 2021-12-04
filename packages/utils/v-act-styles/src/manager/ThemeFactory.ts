import { VActThemeOptions } from "@v-act/styles";
import ThemeInfo from "../types/ThemeInfo";
import { getDefaultVars } from '../utils/ThemeUtils';

class ThemeFactory{
    pool: {
        [proName:string]: {
            obj:ThemeInfo,
            vars:{//主题变量
                vact:VActThemeOptions,
                [proName:string]:Object//命名空间-->命名空间或变量集合
            }
        }
    } = {}

    /**
     * 注册主题
     * @param themeOptions 主题对象或者主题信息
     */
    register(themeOptions: Array<{
        code:string,//主题编码
        name:string,//主题名称
        vars:{//主题变量
            [proName:string]:Object//命名空间-->命名空间或变量集合
        }
    }>){
        themeOptions.map((themeOption)=>{
            const {code, name, vars} = themeOption;
            vars.vact = getDefaultVars();
            const varsObj:{//主题变量
                vact:VActThemeOptions
                [proName:string]:Object//命名空间-->命名空间或变量集合
            } = {
                vact:getDefaultVars()
            }
            if(vars){
                for (const key in vars) {
                    if (Object.prototype.hasOwnProperty.call(vars, key)) {
                        varsObj[key] = vars[key];;
                    }
                }
            }
            this.pool[code] = {
                obj: new ThemeInfo(code,name),
                vars: varsObj
            }
        });
    }

    /**
     * 卸载主题
     * @param code 主题编码
     */
    unRegister(code:string):void{
        delete this.pool[code];
    }
    /**
     * 获取主题列表
     * @returns 主题列表
     */
    getThemes():ThemeInfo[]{
        return Object.values(this.pool).map((info)=>{
            return info.obj;
        });
    }

    getVars(code:string):{
        vact:VActThemeOptions,
        [proName:string]:Object
    }|undefined{
        return this.pool[code].vars;
    }
}

const instance = new ThemeFactory();

export default instance;