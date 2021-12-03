import React from "react";
import { ThemeProvider } from '@mui/styles';
import { EventManager } from '../manager/EventManager';
import { Theme } from '@mui/material/styles';

/**
 * vact主题提供者
 */
class VactThemeProvider extends React.Component<{theme: Theme}> {
    themeHandler: Function | null = null
    theme: Theme | null = null
    state = {
        theme:Object,
        _useStateTheme:false//判断是否使用state的theme
    }
    componentDidMount() {
        const { theme } = this.state;
        this.themeHandler = (newTheme: Theme) => {
            this.setState({
                theme: newTheme,
                _useStateTheme:true
            });
        }
        EventManager.register(theme, this.themeHandler);
    }
    componentWillReceiveProps(){
        this.setState({//组件重新接收prop时，设置为不使用state的theme
            _useStateTheme:false
        })
    }
    componentWillUnmount() {
        this.themeHandler != null && EventManager.unRegister(this.themeHandler);
    }
    render() {
        let theme = this.state._useStateTheme ? this.state.theme : this.props.theme
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