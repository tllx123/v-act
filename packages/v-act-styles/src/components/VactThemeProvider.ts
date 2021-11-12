import React from "react";
import { ThemeProvider } from '@mui/styles';
import {EventManager} from '../manager/EventManager';

/**
 * vact主题提供者
 */
class VactThemeProvider extends React.Component {
    state = {
        theme: this.props.theme
    }
    componentDidMount(){
        const {theme} = this.state;
        this.themeHandler = (newTheme)=>{
            console.log("setState", newTheme);
            this.setState({theme:newTheme});
        }
        EventManager.register(theme, this.themeHandler)
    }
    componentWillUnmount(){
        EventManager.unRegister(this.themeHandler);
    }
    render() {
        const { theme:{vars} } = this.state;
        return (
            <ThemeProvider theme={vars}>
                {
                    this.props.children
                }
            </ThemeProvider>
        );
    }
}

export {
    VactThemeProvider
}