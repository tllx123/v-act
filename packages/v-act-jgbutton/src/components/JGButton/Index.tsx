import React,{CSSProperties} from "react";
import {useTheme} from "@v-act/styles";

interface JGButtonProps {
    Left: string;
    Top: string;
    MultiWidth: string;
    MultiHeight: string;
    Code: string;
    LabelText: string;
    Width: string;
    PercentHeight: string;
    PercentWidth: string;
    TabIndex: string;
}

/**
 * @class Button
 * @description
 */
function JGButton(props: JGButtonProps) {
    const [hover,setHover] = React.useState(false);
    const theme = useTheme();
    const { LabelText, Top, Left, MultiHeight, MultiWidth } = props;
    const buttonStyle: CSSProperties = {
        position: "absolute",
        left: parseInt(Left || "0"),
        top: parseInt(Top || "0"),
        width: MultiWidth,
        height: MultiHeight,
        color: "white",
        cursor: "pointer",
        border: "1px solid " + theme.vact.primaryColor,
        borderRadius: theme.vact.borderRadiusBase,
        backgroundColor: theme.vact.primaryColor,
        opacity:1
    };
    if(hover){
        buttonStyle.backgroundColor = theme.vact.primaryColor
        buttonStyle.opacity = 0.8;
    }
    const onHover = ()=>setHover(true);
    const onLeave = ()=>setHover(false);
    return (
        <button style={buttonStyle} onMouseOver={onHover} onMouseOut={onLeave} onFocus={()=>0} onBlur={()=>0}>{LabelText}</button>
    )
}

export default JGButton;