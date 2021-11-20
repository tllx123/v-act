
import JGButton from "@v-act/jgbutton";
import JGTextBox from "@v-act/jgtextbox";
import { createTheme, ThemeProvider } from '@v-act/styles';

const theme = createTheme();

function Index(){
    return (
        <ThemeProvider theme={theme}>
            $${windowScript}
        </ThemeProvider>
    );
}

export default Index;