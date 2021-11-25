/**
 * 语言对象
 */
class Language{

    //语言编码
    code!:string

    //语言名称
    name?:string

    constructor(code:string, name?:string){
        this.code = code;
        this.name = name;
    }

    /**
     * 获取语言编码
     * @returns 语言编码
     */
    getCode():string{
        return this.code;
    }
    
    /**
     * 获取语言名称
     * @returns 语言名称
     */
    getName():string{
        return this.name || this.code;
    }
}

export default Language;