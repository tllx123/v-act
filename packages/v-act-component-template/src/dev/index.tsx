
import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../index';
import reportWebVitals from './reportWebVitals';
import "./index.css";
//import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@v-act/styles';

const theme = createTheme();

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Index></Index>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals(console.log);
