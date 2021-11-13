import { createTheme } from '@mui/material';
import { VactThemeProvider } from '../components/VactThemeProvider';
import { EventManager } from './EventManager';
import mockData from '../mock/mockData.json';
import {Theme} from "@mui/material/styles"

export * from '@mui/material/styles'

/**
 * 当前使用主题
 */
// let nowTheme;
//默认主题
const defaultThemeCode = mockData.defaultTheme;
//第三方主题变量
const themeVars = mockData.themes;
//转换成vact主题对象
const themeObjs: Theme[] = [];
// themeVars.map((item: Object) => {
//     return createTheme(item);
// });


/**
 * 获取主题列表
 * @returns {Array<Object>}
 * {
 *  code    主题编码
 *  name    主题名称
 * }
 */
function getThemes(): Theme[] {
    return themeObjs;
}

/**
 * 设置主题
 * @param {Object} theme 主题对象
 */
function setTheme(theme: Theme) {
    const themeCode = theme.code;
    const newThemes = themeObjs.filter((item: Theme) => {
        return item.code == themeCode;
    });
    if (newThemes.length > 0) {
        EventManager.fire(newThemes[0]);
    }
}
/**
 * 创建默认主题
 * @returns 
 */
function createVactTheme(props: any) {
    let theme;
    if (props) {
        theme = createTheme(props);
    } else {
        const newThemes = themeObjs.filter((item: Theme) => {
            return item.code == defaultThemeCode
        });
        if (newThemes.length > 0) {
            theme = newThemes[0]
        }else{
            throw new Error("无法创建主题");
        }
    }
    return theme;
}
export {
    VactThemeProvider as ThemeProvider,//主题提供者
    getThemes,
    setTheme,
    createVactTheme as createTheme
}