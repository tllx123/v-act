import { Theme } from "@mui/material";

interface VActTheme extends Theme{
    code: string,
    name: string,
    vars: {
        [proName: string]: string
    }
}

export default VActTheme;