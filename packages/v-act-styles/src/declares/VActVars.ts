interface VActThemeOptions{
    /**
     * 主色
     **/
     primaryColor: string;

     /**
      * 消息提示
      **/
     infoColor: string;

     /**
      * 成功提示
      **/
     successColor: string;

     /**
      * 警告提示
      **/
     warningColor: string;

     /**
      * 失败提示
      **/
     errorColor: string;

     /**
      * 超链接
      **/
     linkColor: string;

     /**
      * 标题
      **/
     textTitleColor: string;

     /**
      * 正文
      **/
     textBaseColor: string;

     /**
      * 描述
      **/
     textSecondaryColor: string;

     /**
      * 默认圆角
      **/
     borderRadiusBase: string;

     /**
      * 小圆角
      **/
     borderRadiusSmall: string;

     /**
      * 外边框
      **/
     borderBaseColor: string;

     /**
      * 分割线
      **/
     borderSplitColor: string;

     /**
      * 背景色
      **/
     backgroundBaseColor: string;

     /**
      * 斑马线
      **/
     backgroundStripeColor: string;

     /**
      * 禁用文本色
      **/
     disabledColor: string;

     /**
      * 禁用背景色
      **/
     disabledBg: string
}

declare module "@mui/material/styles" {
    interface Theme {
        vact: VActThemeOptions;
    }
    interface ThemeOptions {
        vact: VActThemeOptions
    }
}
export{
    type VActThemeOptions
}