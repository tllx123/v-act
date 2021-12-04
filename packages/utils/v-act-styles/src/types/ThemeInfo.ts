/**
 * 第三方对接的主题对象
 */
class ThemeInfo {
    //主题编码
    code!: string
    //主题名称
    name!: string

    constructor(code:string, name:string){
        this.code = code;
        this.name = name;
    }

    /**
     * 设置主题编码
     * @param code 主题编码
     */
    setCode(code: string):void {
        this.code = code;
    }

    /**
     * 设置主题名称
     * @param name 主题名称
     */
    setName(name: string):void {
        this.name = name;
    }

    /**
     * 获取主题编码
     * @returns 主题编码
     */
    getCode():string {
        return this.code;
    }

    /**
     * 获取主题名称
     * @returns 主题名称
     */
    getName():string {
        return this.name;
    }
}

export default ThemeInfo