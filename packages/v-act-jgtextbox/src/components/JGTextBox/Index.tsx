import * as React from "react";
import { useTheme } from "@v-act/styles";

interface JGTextBoxProps {
    Left: string;
    Top: string;
    MultiWidth: string;
    MultiHeight: string;
    Code: string;
    LabelText: string;
    PercentHeight: string;
    PercentWidth: string;
    TabIndex: string;
}

function JGTextBox(props: JGTextBoxProps) {
    const [focus,setFocus] = React.useState<boolean>(false);
    const { LabelText, Top, Left, MultiHeight, MultiWidth } = props;
    const theme = useTheme();
    let inputStyle = {
        width: parseInt(MultiWidth || "235px") - 76,
        height: MultiHeight || "26px",
        padding: "0 4px",
        border: "1px solid "+theme.vact.borderBaseColor,
        color: "#333",
        fontSize: "14px",
        borderRadius: theme.vact.borderRadiusBase,
        outline: "none"
    };
    const inputFocus = ()=> setFocus(true);
    const inputBlur = ()=> setFocus(false);
    if(focus){
        inputStyle.border = "1px solid "+theme.vact.primaryColor;
    }
    return (
        <div style={{
            position: "absolute",
            width: MultiWidth || "235px",
            height: MultiHeight || "26px",
            left: Left ? parseInt(Left) + "px" : "0px",
            top: Top ? parseInt(Top) + "px" : "0px"
        }}>
            <div style={{
                position: "absolute",
                width: 68,
                fontSize: "14px",
                lineHeight: MultiHeight || "26px",
                textAlign: "right",
                height: MultiHeight || "26px",
                paddingRight: 8
            }}>{LabelText || "文本"}</div>
            <div style={{
                position: "absolute",
                left: 76,
                height: MultiHeight || "26px",
                width: parseInt(MultiWidth || "235px") - 76
            }}>
                <input style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}></input>
            </div>
        </div>
    )
}

export default JGTextBox;