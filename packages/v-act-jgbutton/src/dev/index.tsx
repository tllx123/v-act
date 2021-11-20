
import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../index';
import reportWebVitals from './reportWebVitals';
import "./index.css";
import { createTheme, ThemeProvider } from '@v-act/styles';

const theme = createTheme();

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Index  Code="JGButton1" LabelText="按钮1" Width="59" PercentHeight="5.8%" PercentWidth="6.1%" Top="189" Left="230" TabIndex="0" MultiHeight="26px" MultiWidth="59px" ></Index>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals(console.log);
