import { ThemeOptions } from '@mui/material';

declare module '@mui/material' {
    // allow configuration using `createTheme`
    interface ThemeOptions {
        code: string,
        name: string
    }
}

export default {}