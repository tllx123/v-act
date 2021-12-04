/**
 * 语言项
 */
class LanguageItem {

    //语言项编码
    code!: string

    //语言项描述文字
    name?: string

    //翻译值
    value?: string | null

    constructor(code: string, name?: string, value?: string | null) {
        this.code = code;
        this.name = name;
        this.value = value;
    }

    /**
     * 获取语言项编码
     * @returns 语言项编码
     */
    getCode() {
        return this.code;
    }

    /**
     * 获取语言项文字
     * @returns 语言项文字
     */
    getName() {
        return this.name || this.code;
    }

    /**
     * 获取翻译值
     * @returns 翻译值
     */
    getValue() {
        return this.value;
    }
}


export default LanguageItem