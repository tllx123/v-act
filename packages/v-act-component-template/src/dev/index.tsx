
import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../index';
import reportWebVitals from './reportWebVitals';
import "./index.css";
import { ThemeProvider,createTheme } from "@v-act/styles";

const theme = createTheme({
    demo:{
        color:'#356bbc',
        backgroundColor:'#eee'
    }
});

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Index></Index>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals(console.log);
