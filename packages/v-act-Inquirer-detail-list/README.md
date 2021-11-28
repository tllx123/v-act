A Detail List Prompt for inquirer,use left/right arrow key to collapse/expand choice‘s detail. you need provide a query handler to request choice's detail.

# QuickDemo
![QuickDemo](https://github.com/opensource-vplatform/v-act/blob/main/assets/v-act-inquirer-detail-list/quickdemo.gif)
# Installation
```sh
npm install @v-act/inquirer-detail-list
```

# Usage
This prompt is anonymous, meaning you can register this prompt with the type name you please:
```js
const inquirer = require('inquirer');
inquirer.registerPrompt('detailList', require('@v-act/inquirer-detail-list'));
inquirer.prompt({
  type: 'detailList',
  ...
})
```
Change detailList to whatever you might prefer.
# Options