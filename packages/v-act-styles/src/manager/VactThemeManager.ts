import "../declares/VActVars";
import { Theme } from "@mui/material/styles";
import { createTheme, ThemeOptions } from '@mui/material';
import { EventManager } from '../manager/EventManager';
import ThemeFactory from '../manager/ThemeFactory';
import ThemeInfo from '../types/ThemeInfo';

/**
 * 获取主题列表
 * @returns {Array<ThemeInfo>}
 * {
 *  code    主题编码
 *  name    主题名称
 * }
 */
function getThemes(): Array<ThemeInfo> {
    return ThemeFactory.getThemes();
}
/**
 * 设置主题
 * @param {String} themeCode 主题对象
 */
function setTheme(themeCode: string):void {
    const vars = ThemeFactory.getVars(themeCode);
    if(vars != undefined){
        const theme = createTheme(vars);
        EventManager.fire(theme);
    }
}
/**
 * 创建主题
 * @param props {Object|string} 主题属性
 * @returns 
 */
function createVactTheme(props?: Object|string): Theme {
    let themeOptions;
    if (null == props || typeof(props) =="string") {
        const infos = ThemeFactory.getThemes();
        const info = typeof(props) =="string" ? infos.filter(info => info.code == props)[0] : infos[0];
        if(info){
            themeOptions = ThemeFactory.getVars(info.getCode());
        }
    } else {
        themeOptions = props;
    }
    return (themeOptions ? createTheme(<ThemeOptions>themeOptions) : createTheme());
}
export {
    getThemes,
    setTheme,
    createVactTheme
}