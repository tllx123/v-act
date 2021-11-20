
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
            <Index  Code="JGTextBox1" LabelText="文本" PercentHeight="5.8%" PercentWidth="24.5%" Top="112" Left="240" TabIndex="0" MultiHeight="26px" MultiWidth="235px" ></Index>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals(console.log);
