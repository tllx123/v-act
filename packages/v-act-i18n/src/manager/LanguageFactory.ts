import ILanguageProvider from '../interface/ILanguageProvider';
/**
 * 语言工厂
 */
class LanguageFactory {

    pool: {
        [proName: string]: ILanguageProvider
    } = {}

    /**
     * 注册语言
     * @param languageProvider 语言提供者
     */
    register(languageProvider: ILanguageProvider) {
        const code = languageProvider.getCode();
        this.pool[code] = languageProvider;
    }
    /**
     * 注销语言
     * @param languageProvider 语言提供者的标志
     */
    unRegister(languageProviderCode: string) {
        delete this.pool[languageProviderCode];
    }
    /**
     * 根据标志获取语言提供者对象
     * @param code 语言提供者的标志
     * @returns 语言提供者
     */
    getLanguageProvider(code: string): ILanguageProvider {
        return this.pool[code];
    }
}


const instance = new LanguageFactory();

export default instance;