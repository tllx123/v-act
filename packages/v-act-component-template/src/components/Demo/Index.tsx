import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import logo from "./assets/logo.svg";
import styles from "./styles/Demo.module.css";

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
function Demo() {
    return (
        <Paper elevation={6}>
            <Card>
                <div className={styles.demo}>
                    <header className={styles.header} style={{
                        backgroundColor: '#356bbc'
                    }}>
                        <button>切换主题</button>
                        <button>切换语言</button>
                    </header>
                    <div className={styles.content} style={{
                        color: '#356bbc'
                    }}>
                        <img src={logo} className={styles.logo} alt="logo" />
                        <h1>欢迎进行V平台React组件开发</h1>
                        <h6>这是你是天马行空的创作天地</h6>
                        <p>
                            编辑
                            <code>src/components/Demo/Index.tsx</code>
                            文件试试吧！
                        </p>
                        <a
                            className={styles.link}
                            href="https://reactjs.org"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            开始学习
                        </a>
                    </div>
                </div>
            </Card>
        </Paper>
    )
}

export default Demo;