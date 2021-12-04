import styles from '../../../styles/Home.module.css';
import { setLanguage, useTranslation, getLanguages } from "@v-act/i18n"
import { Theme, getThemes, setTheme, useTheme } from "@v-act/styles";

function Top() {
    //#region 多语言
    const { t } = useTranslation();
    const languages = getLanguages();
    //#endregion

    //#region 样式
    //当前使用的主题
    const theme: Theme = useTheme();
    //全部主题
    const themes = getThemes();
    const { btn: { color, bgcolor } } = theme;
    const topStyle = {
        color: color,
        background: bgcolor,
        borderColor: bgcolor
    }
    //#endregion
    return (
        <div className={styles.top}>
            <select className={styles.topselect} style={topStyle} onChange={baseEvent => {
                const selectCode = baseEvent.currentTarget.value;
                const selectLanguage = languages.find((t) => t.code === selectCode)
                if (selectLanguage)
                    setLanguage(selectLanguage);
            }}>
                {
                    languages.map((language) => {
                        const code = language.code;
                        return (<option key={code} value={code}>{t(code)}</option>);
                    })
                }
            </select>
            <select className={styles.topselect} style={topStyle} onChange={baseEvent => {
                const selectCode = baseEvent.currentTarget.value;
                const selectTheme = themes.find((t) => t.code === selectCode)
                if (selectTheme)
                    setTheme(selectTheme.getCode());
            }}>
                {
                    themes.map((theme) => {
                        const code = theme.code;
                        return (<option key={code} value={code}>{t(theme.code)}</option>);
                    })
                }
            </select>
        </div>
    )
}

export default Top
