import * as React from "react";
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';

import logo from "./assets/logo.svg";
import styles from "./styles/Demo.module.css";
import { useTheme, getThemes, ThemeInfo } from '@v-act/styles';


/**
 * @class Demo
 * @description
 */
function Demo() {
    const theme = useTheme();
    const menus: Array<{ code: string, title: string }> = [];
    const menusObj = getThemes();
    menusObj.forEach((menu: ThemeInfo) => {
        menus.push({
            code: menu.getCode(),
            title: menu.getName()
        });
    });
    return (
        <Paper elevation={6} className={styles.paper}>
            <div className={styles.demo}>
                <div className={styles.content} style={{
                    color: theme.vact.primaryColor,
                    backgroundColor: theme.vact.backgroundBaseColor
                }}>
                    <Container>
                        <Card style={{
                            margin: '16px'
                        }}>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                    </Container>
                </div>
            </div>
        </Paper>
    )
}

export default Demo;