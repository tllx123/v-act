import vars from  '../../var/default';
import IThemePackage, { ThemePackageFactroy } from '../../interface/IThemePackage';
import ThemeInfo from '../../types/ThemeInfo';
import {VActThemeOptions} from '../../declares/VActVars';

const vactCode:string = "Vact";
const vactName:string = "Vact默认主题";
const vact:VActThemeOptions = vars;

const defaultTheme = new ThemeInfo(vactCode, vactName, vact);

const themes = [defaultTheme];

class VactImpl implements IThemePackage {

    getCode(): string {
        return vactCode;
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
        return themes;
    }
}
const instance = new VactImpl();

ThemePackageFactroy.register(instance);

export default instance as VactImpl