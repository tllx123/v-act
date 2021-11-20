import logo from "./img/logo.svg";
import styles from "./css/intro.module.css";
import {useTheme} from "@v-act/styles";

function Intro(){
    const theme = useTheme();
    return (
        <div className={styles.demo}>
            <div className={styles.content} style={{
                color: theme.vact.primaryColor
            }}>
                <img src={logo} className={styles.logo} alt="logo" />
                <h1>欢迎进行VAct项目开发</h1>
                <h6>这是你是天马行空的创作天地</h6>
                <p>
                    编辑
                    <code>pages/intro/Index.tsx</code>
                    文件试试吧！
                </p>
                <a
                    className="link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    开始学习
                </a>
            </div>
        </div>
    );
}

export default Intro;