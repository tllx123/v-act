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
                    color: "#356abb"
                }}>
                    <img src={logo.src} className="logo" alt="logo" />
                    <h1>welcome</h1>
                    <h6>desc</h6>
                    <p>
                        edit&nbsp;
                        <code>src/components/Demo/Index.tsx</code>&nbsp;
                        tips
                    </p>
                    <a
                        className="link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        startLearn
                    </a>
                </div>
            </div>
        );
    }

}

export default Intro;