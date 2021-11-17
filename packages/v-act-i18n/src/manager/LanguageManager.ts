import ILanguageProvider from '../interface/ILanguageProvider';
import LanguageFactory from './LanguageFactory';

//#region 测试代码
import V3Impl from '../mockDatas/v3/V3Impl'
import VActImpl from '../mockDatas/vact/VActImpl'

LanguageFactory.register(V3Impl);
LanguageFactory.register(VActImpl);
//#endregion

/**
 * 语言管理者
 */
class LanguageManager {
    /**
     * 获取当前语言提供者的编码
     * @returns 
     */
    getLanguageProviderCode():string{
        return "VAct";
    }
    
    getCurrentLanguageProvider():ILanguageProvider{
        const code = this.getLanguageProviderCode();
        return LanguageFactory.getLanguageProvider(code);
    }
}


const instance = new LanguageManager();

export default instance;