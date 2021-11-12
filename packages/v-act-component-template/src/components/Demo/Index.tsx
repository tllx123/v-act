import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import logo from "./assets/logo.svg";
import styles from "./styles/Demo.module.css";
import { useTheme } from '@v-act/styles';

/*declare module '@v-act/styles' {
    interface Theme {
      demo: {
        color: string,
        backgroundColor: string
      };
    }
    interface ThemeOptions {
        demo: {
            color: string,
            backgroundColor: string
      };
    }
  }*/

/**
 * @class Demo
 * @description
 */
function Demo() {
    const theme = useTheme();
    return (
        <Paper elevation={6}>

            <div className={styles.demo}>
                <header className={styles.header} style={{
                    backgroundColor: theme.demo.color
                }}>
                    <button>切换主题</button>
                    <button>切换语言</button>
                </header>
                <div className={styles.content} style={{
                    color: theme.demo.color,
                    backgroundColor: theme.demo.backgroundColor
                }}>
                    <Card style={{
                        padding:'16px'
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
                    </Card>
                </div>
            </div>
        </Paper>
    )
}

export default Demo;