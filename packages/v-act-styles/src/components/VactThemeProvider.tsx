import React from "react";
import { ThemeProvider } from '@mui/styles';
import { EventManager } from '../manager/EventManager';
import {Theme} from '@mui/material/styles';

/**
 * vact主题提供者
 */
class VactThemeProvider extends React.Component<{theme: Theme}> {
    themeHandler: Function | null = null
    theme: Theme | null = null
    state = {
        theme: Object
    }
    componentDidMount() {
        const { theme } = this.state;
        this.themeHandler = (newTheme: Object) => {
            this.setState({
                theme: newTheme
            });
        }
        EventManager.register(theme, this.themeHandler)
    }
    componentWillUnmount() {
        this.themeHandler != null && EventManager.unRegister(this.themeHandler);
    }
    render() {
        const proTheme = this.theme;
        const { theme } = this.state;
        console.log("proTheme： ", proTheme);
        console.log("stateTheme ", theme);
        return (
            <ThemeProvider theme={theme} >
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