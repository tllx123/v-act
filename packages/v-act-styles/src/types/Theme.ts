import { Theme } from "@mui/material";

declare module '@mui/material' {
    export interface Theme {
        status: {
            danger: string;
        }
        code: string,
        name: string,
        vars: {
            [proName: string]: string
        }
    }
}
export default Theme