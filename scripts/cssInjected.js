export default function cssInjectedByJsPlugin(
  { topExecutionPriority } = { topExecutionPriority: true }
) {
  //Globally so we can add it to legacy and non-legacy bundle.
  let cssToInject = ''
  return {
    apply: 'build',
    enforce: 'post',
    name: 'css-in-js-plugin',
    generateBundle(opts, bundle) {
      let styleCode = ''
      for (const key in bundle) {
        if (bundle[key]) {
          const chunk = bundle[key]
          if (chunk.type === 'asset' && chunk.fileName.includes('.css')) {
            styleCode += chunk.source
            delete bundle[key]
          }
        }
      }
      if (styleCode.length > 0) {
        cssToInject = styleCode.trim()
      }
      for (const key in bundle) {
        if (bundle[key]) {
          const chunk = bundle[key]
          if (
            chunk.type === 'chunk' &&
            chunk.fileName.includes('.js') &&
            !chunk.fileName.includes('polyfill')
          ) {
            let topCode = ''
            let bottomCode = ''
            if (topExecutionPriority) {
              bottomCode = chunk.code
            } else {
              topCode = chunk.code
            }
            // 字符串序列化操作
            let temp = JSON.stringify({ temp: cssToInject })
            temp.length > 12 && (temp = temp.slice(9, -2))

            chunk.code = `${topCode}(function(){ try {var elementStyle = document.createElement('style'); elementStyle.innerText = \`${temp}\`; document.head.appendChild(elementStyle);} catch(e) {console.error(e, 'vite-plugin-css-injected-by-js: error when trying to add the style.');} })();${bottomCode}`
            break
          }
        }
      }
    },
    transformIndexHtml: {
      enforce: 'post',
      transform(html, ctx) {
        if (!ctx || !ctx.bundle) return html
        for (const [, value] of Object.entries(ctx.bundle)) {
          if (value.fileName.endsWith('.css')) {
            // Remove CSS link from HTML generated.
            const reCSS = new RegExp(
              `<link rel="stylesheet"[^>]*?href="/${value.fileName}"[^>]*?>`
            )
            html = html.replace(reCSS, '')
          }
        }
        return html
      }
    }
  }
}