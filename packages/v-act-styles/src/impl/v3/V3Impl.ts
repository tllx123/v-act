/**
 * v3对接vact主题的实现逻辑
 */

import mockData from './mockData.json';
import IThemePackage, { ThemePackageFactroy } from '../../interface/IThemePackage';
import ThemeInfo from '../../types/ThemeInfo'

//主题列表
const themes: Array<{
    code: string
    name: string
    vact: {
        [proName: string]: Object
    }
}> = mockData.themes;

const newThemes: Array<ThemeInfo> = themes ? themes.map((item: {
    code: string
    name: string
    vact: {
        [proName: string]: Object
    }
}) => {
    return new ThemeInfo(item.code, item.name, item.vact);
}) : []

//默认主题编码
const defaultThemeCode: String = mockData.defaultTheme;
//默认主题
const defaultTheme: ThemeInfo = defaultThemeCode ? newThemes.filter((item: { code: string }) => {
    return item.code === defaultThemeCode;
})[0] : newThemes[0];

class V3Impl implements IThemePackage {

    getCode(): string {
        return "V3";
    }

    /**
     * 获取默认主题对象
     * @returns {ThemeInfo} 默认主题对象
     */
    getDefaultTheme(): ThemeInfo {
        return defaultTheme;
    }
    /**
     * 获取所有主题信息
     * @returns 所有主题信息
     */
    getThemes(): Array<ThemeInfo> {
        return newThemes;
    }
}

const instance = new V3Impl();

ThemePackageFactroy.register(instance);

export default instance as V3Impl