import { Component } from "react";
import vactSkin from "v-act-skin";
import {withTranslation} from 'react-i18next';
import logo from "./assets/logo.svg";
import styles from "./styles/Demo.module.css";
import "./i18n/index";
import vactI18n from "v-act-i18n";

interface state {
    skinWatcher: any,
    skinVars: any,
    skinIndex: number,
    langIndex: number
}

/**
 * @class Demo
 * @description
 */
class Demo extends Component<any, state>{

    constructor(pros: Object) {
        super(pros);
        const namespace = vactSkin.getComponentNamespace("Demo");
        const watcher = vactSkin.getSkinWacther(namespace);
        this.state = {
            skinWatcher:watcher,
            skinVars: watcher.getVars(),
            skinIndex:0,
            langIndex:0
        };
        //监听皮肤切换
        watcher.onSkinChanged((skin) => {
            const vars = skin.getVars();
            this.setState({
                skinVars: vars
            });
        });
    }

    render() {
        const {t} = this.props;
        return (
            <div className={styles.demo}>
                <header className={styles.header} style={{
                    backgroundColor: this.state.skinVars.primaryColor
                }}>
                    <button onClick={this.changeSkin}>{t("切换主题")}</button>
                    <button onClick={this.changeLang}>{t("切换语言")}</button>
                </header>
                <div className={styles.content} style={{
                    color: this.state.skinVars.primaryColor
                }}>
                    <img src={logo} className={styles.logo} alt="logo" />
                    <h1>{t("欢迎进行V平台React组件开发")}</h1>
                    <h6>{t("这是你是天马行空的创作天地")}</h6>
                    <p>
                        {t("编辑")}
                        <code>src/components/Demo/Index.tsx</code>
                        {t("文件试试吧！")}
                    </p>
                    <a
                        className={styles.link}
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t("开始学习")}
                    </a>
                </div>
            </div>
        );
    }

    changeSkin = ()=>{
        let index = this.state.skinIndex + 1;
        const promise = vactSkin.getSkins();
        promise.then((skins)=>{
            index = index<skins.length ? index:0;
            let skin = skins[index];
            vactSkin.setSkin(skin.code);
            this.setState({
                skinIndex:index
            });
        });
    }

    changeLang= ()=>{
        let promise = vactI18n.getLanguages();
        promise.then((langs)=>{
            let index = this.state.langIndex + 1;
            index = index<langs.length ? index:0;
            let lang = langs[index];
            vactI18n.setLanguage(lang.code);
            this.setState({
                langIndex:index
            })
        });
    }

    componentWillUnmount(){
        vactSkin.destroyWatcher(this.state.skinWatcher);
    }

}

export default withTranslation(vactI18n.getComponentNamespace("Demo"))(Demo);