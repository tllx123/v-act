import AnswerType from './AnswerType';
/**
 * 问题对象
 */
class Question {
    //问题编码
    name = ""
    //提示文字
    message = ""
    //默认值
    def = null
    //回答类型
    type = AnswerType.input
    //值过滤
    filter = null
    //候选项。当type = AnswerTypes.list有效
    choices = null
    /**
     * 创建问题对象
     * @param {String} name 问题编码
     * @param {String} message 提示文字
     * @param {AnswerType} type 问题类型
     * @param {any} def 默认值
     * @param {Function} filter 答案处理器
     * @param {Arrya<String>} choices 候选项。当type = AnswerTypes.list有效
     */
    constructor(name, message, type, def, filter = null, choices = null) {
        this.name = name;
        this.message = message;
        this.type = type;
        this.def = def;
        this.filter = filter;
        this.choices = choices;
    }
    /**
     * 设置问题编码
     * @param name 问题编码
     */
    setName(name) {
        this.name = name;
    }
    /**
     * 设置提示文字
     * @param message 提示文字
     */
    setMessage(message) {
        this.message = message;
    }
    /**
     * 设置默认值
     * @param def 默认值
     */
    setDefault(def) {
        this.def = def;
    }
    /**
     * 设置回答类型
     * @param type 回答类型
     */
    setType(type) {
        this.type = type;
    }
    /**
     * 设置值过滤
     * @param filter 值过滤
     */
    setFilter(filter) {
        this.filter = filter;
    }
    /**
     * 设置候选项
     * @param choices 候选项
     */
    setChoices(choices) {
        this.choices = choices;
    }

    /**
     * 获取问题编码
     * @returns 问题编码
     */
    getName() {
        return this.name
    }
    /**
     * 获取提示文字
     * @returns 提示文字
     */
    getMessage() {
        return this.message;
    }
    /**
     * 获取默认值
     * @returns 默认值
     */
    getDefault() {
        return this.def;
    }
    /**
     * 获取回答类型
     * @returns 回答类型
     */
    getType(){
        return this.type;
    }
    /**
     * 获取值过滤
     * @returns 值过滤
     */
    getFilter() {
        return this.filter;
    }
    /**
     * 获取候选项
     * @returns 候选项
     */
    getChoices() {
        return this.choices;
    }
    /**
     * 转map对象
     * @returns map
     */
    toMap(){
        return {
            name:this.name,
            message:this.message,
            default:this.def,
            filter:this.filter,
            choices:this.choices,
        }
    }
}

export default Question