
import React from 'react';
import ReactDOM from 'react-dom';
import "./skins/index";
import Index from '../index';
import reportWebVitals from './reportWebVitals';
import "./index.css";

ReactDOM.render(
    <React.StrictMode>
        <Index></Index>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals(console.log);
