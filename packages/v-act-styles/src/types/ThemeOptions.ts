import { ThemeOptions } from '@mui/material';

declare module '@mui/material' {
    // allow configuration using `createTheme`
    interface ThemeOptions {
        vars?: {
            [pro: string]: any;
        };
    }
}

export default ThemeOptions