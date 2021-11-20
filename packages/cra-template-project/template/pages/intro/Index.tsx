import {Component} from "react";
import {withTranslation} from 'react-i18next';
import logo from "./img/logo.svg";
import "./css/intro.module.css";

interface state {
    skinVars: any,
    skinIndex: number,
    langIndex: number
}

class Intro extends Component<any, state>{

    render(){
        return (
            <div className="demo">
                <header className="header" style={{
                    backgroundColor: this.state.skinVars.vPrimaryColor
                }}>
                    <button>{t("changeTheme")}</button>
                    <button>{t("changeLang")}</button>
                </header>
                <div className="content" style={{
                    color: this.state.skinVars.vPrimaryColor
                }}>
                    <img src={logo} className="logo" alt="logo" />
                    <h1>{t("welcome")}</h1>
                    <h6>{t("desc")}</h6>
                    <p>
                        {t("edit")}
                        <code>src/components/Demo/Index.tsx</code>
                        {t("tips")}
                    </p>
                    <a
                        className="link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t("startLearn")}
                    </a>
                </div>
            </div>
        );
    }

}

export default withTranslation()(Intro);