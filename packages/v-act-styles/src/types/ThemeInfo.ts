import { VActThemeOptions } from '../declares/VActVars';
import { ThemeOptions } from "@mui/material/styles";

/**
 * 第三方对接的主题对象
 */
class ThemeInfo {
    //主题编码
    code: string = "defaultTheme"
    //主题名称
    name: string = "默认主题"
    //主题变量
    vact: VActThemeOptions;

    constructor(code: string, name: string, vact: VActThemeOptions) {
        this.code = code;
        this.name = name;
        this.vact = vact;
    }

    /**
     * 设置主题编码
     * @param code 主题编码
     */
    setCode(code: string) {
        this.code = code;
    }

    /**
     * 设置主题名称
     * @param name 主题名称
     */
    setName(name: string) {
        this.name = name;
    }

    /**
     * 设置主题变量
     * @param vact 主题变量
     */
    setVact(vact: VActThemeOptions) {
        this.vact = vact;
    }

    /**
     * 获取主题编码
     * @returns 主题编码
     */
    getCode() {
        return this.code;
    }

    /**
     * 获取主题名称
     * @returns 主题名称
     */
    getName() {
        return this.name;
    }
    /**
     * 获取主题变量
     * @returns 主题变量
     */
    getVact() {
        return this.vact;
    }
    /**
     * 转成map对象
     */
    toMap():ThemeOptions{
        return {
            code: this.code,
            name: this.name,
            vact: this.vact
        }
    }
}

export default ThemeInfo