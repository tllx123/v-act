export { makeStyles, useTheme } from '@mui/styles';
export * from '@mui/material/styles'

export { getThemes, setTheme, createVactTheme as createTheme } from './manager/VactThemeManager';
export { default as ThemeInfo } from "./types/ThemeInfo";
export { default as ThemeFactory } from './manager/ThemeFactory';
export { VactThemeProvider as ThemeProvider } from './components/VactThemeProvider';

export type { VActThemeOptions } from './declares/VActVars';

declare module '@v-act/styles';