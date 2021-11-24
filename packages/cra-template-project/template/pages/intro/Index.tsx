import {Component} from "react";
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
                <div className="content" style={{
                    color: "white"
                }}>
                    <img src={logo.src} className="logo" alt="logo" />
                    <h1>欢迎</h1>
                    <p>
                        编辑&nbsp;<code>pages/intro/Index.tsx</code>&nbsp;开启项目之旅
                    </p>
                    <a
                        className="link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        学习指南
                    </a>
                </div>
            </div>
        );
    }

}

export default Intro;