import ThemeInfo from '../types/ThemeInfo'
/**
 * 主题包接口
 */
interface IThemePackage {

    /**
     * 获取主题包标志
     */
    getCode():string

    /**
     * 获取默认主题
     * @returns {ThemeInfo}
     */
    getDefaultTheme(): ThemeInfo

    /**
     * 获取所有主题
     * @returns {Array<ThemeInfo>}
     */
    getThemes(): Array<ThemeInfo>

}
/**
 * 主题包工厂
 */
class ThemePackageFactroy {

    packs:{
        [proName:string]: IThemePackage
    }={}

    /**
     * 注册主题包
     * @param pack 主题包对象
     */
    resiger(pack: IThemePackage): void {
        this.packs[pack.getCode()] = pack;
    }

    /**
     * 卸载主题包
     * @param packObj 主题包对象
     */
    unResiger(packObj: IThemePackage): void {
        delete this.packs[packObj.getCode()];
    }
    /**
     * 获取主题包对象
     * @param code 主题包标志
     * @returns 主题包对象
     */
    getPack(code:string):IThemePackage{
        return this.packs[code];
    }
    /**
     * 获取所有主题包
     * @returns 所有主题包
     */
    getPacks(): Array<IThemePackage> {
        return Object.values(this.packs);
    }

}
export default IThemePackage;

const instance = new ThemePackageFactroy();

export {
    instance as ThemePackageFactroy
}