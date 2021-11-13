import { Theme } from "@mui/material/styles"
import { createTheme, ThemeOptions } from '@mui/material';
import { VactThemeProvider } from '../components/VactThemeProvider';
import { EventManager } from './EventManager';
import ThemeInfo from "../types/ThemeInfo";

import defaultImpl from '../impl/default/VactImpl';

export * from '@mui/material/styles'

/**
 * 当前使用主题
 */
// let nowTheme;

/**
 * 获取主题列表
 * @returns {Array<ThemeInfo>}
 * {
 *  code    主题编码
 *  name    主题名称
 * }
 */
function getThemes(): Array<ThemeInfo> {
    return defaultImpl.getThemes();
}
/**
 * 设置主题
 * @param {ThemeInfo} themeInfo 主题对象
 */
function setTheme(themeInfo: ThemeInfo) {
    const themeCode = themeInfo.getCode();
    const themes: Array<ThemeInfo> = defaultImpl.getThemes();
    const newThemes = themes.filter((item: ThemeInfo) => {
        return item.getCode() == themeCode;
    });
    if (newThemes.length > 0) {
        const themeOption = <ThemeOptions>(newThemes[0].toMap());
        const newTheme = createTheme(themeOption);
        EventManager.fire(newTheme);
    }
}
/**
 * 创建主题
 * @param props {Object|undefined} 主题属性
 * @returns 
 */
function createVactTheme(props: Object|undefined) {
    let themeOptions;
    if (null == props) {
        const defaultTheme: ThemeInfo = defaultImpl.getDefaultTheme();
        if (defaultTheme) {
            const map: Object = defaultTheme.toMap();
            themeOptions = <ThemeOptions>map;
        }
    } else {
        themeOptions = <ThemeOptions>props;
    }
    let theme = createTheme(themeOptions);
    return theme;
}
export {
    VactThemeProvider as ThemeProvider,//主题提供者
    getThemes,
    setTheme,
    ThemeInfo,
    createVactTheme as createTheme
}