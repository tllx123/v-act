/**
 * v3对接vact主题的实现逻辑
 */
// import mockData from './mockData.json';
const mockData={
    defaultTheme:"",
    themes:[]
};
//默认主题编码
const defaultTheme: String = mockData.defaultTheme;
//主题列表
const themes: Array<Object> = mockData.themes;

class V3Impl {
    /**
     * 获取默认主题信息
     * @returns {Object} 默认主题信息
     */
    // getDefaultTheme(): object {
    //     // const defaultThemeObj = themes.filter(item => item["code"] == defaultTheme);
    //     // return defaultThemeObj;
    // }
    /**
     * 获取所有主题信息
     * @returns 所有主题信息
     */
    getThemes():Array<Object>{
        return themes;
    }
}

const instance = new V3Impl();

export default instance as V3Impl