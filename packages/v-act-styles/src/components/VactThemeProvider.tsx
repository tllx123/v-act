import React from "react";
import { ThemeProvider } from '@mui/styles';
import { EventManager } from '../manager/EventManager';
import {Theme, ThemeOptions} from '@mui/material/styles';

/**
 * vact主题提供者
 */
class VactThemeProvider extends React.Component<{theme: Theme}> {
    themeHandler: Function | null = null
    theme: Theme | null = null
    state = {
        theme:Object,
        _custom:false
    }
    componentDidMount() {
        const { theme } = this.state;
        this.themeHandler = (newTheme: Theme) => {
            this.setState({
                theme: newTheme,
                _custom:true
            });
        }
        EventManager.register(theme, this.themeHandler);
    }
    componentWillReceiveProps(){
        this.setState({
            _custom:false
        })
    }
    componentWillUnmount() {
        this.themeHandler != null && EventManager.unRegister(this.themeHandler);
    }
    render() {
        let theme = this.state._custom ? this.state.theme : this.props.theme
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