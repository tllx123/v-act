import React, { useEffect, useState } from 'react'

import PageModal from './PageModal'
import PageStackProvider from './PageStackProvider'

interface PageManagerProperty {
  page: any
  level?: number
  url?: string
  children?: JSX.Element
}

const getTitleFromUrl = function (url?: string | null) {
  if (url) {
    try {
      const query = url.split('#')[0].split('?')[1]
      const queryPair = query.split('&')
      for (let i = 0; i < queryPair.length; i++) {
        const element = queryPair[i]
        const list = element.split('=')
        if (list[0] == 'title') {
          return list[1]
        }
      }
    } catch (e) {
      return ''
    }
  }
  return ''
}

export default function PageManager(props: PageManagerProperty) {
  let { page, level, url } = props
  const [stack, setStack] = useState(() => {
    return [{ page, level: 0, url: null }]
  })
  if (stack[0].page === page) {
    level = 0
  }
  useEffect(() => {
    setStack((prevStack) => {
      return [...prevStack.slice(0, level), { page, url, level: undefined }]
    })
  }, [page, level, url])

  const topLevel = stack.length - 1
  return stack.map((entry, thisLevel) => {
    const { page, url } = entry
    const title = decodeURIComponent(getTitleFromUrl(url))
    const key = `${thisLevel}:${url}`
    return (
      <PageStackProvider key={key} thisLevel={thisLevel} topLevel={topLevel}>
        {thisLevel === 0 ? (
          <div aria-hidden={topLevel > thisLevel} style={{ height: '100%' }}>
            {page}
          </div>
        ) : (
          <PageModal
            title={title}
            onClose={typeof window != 'undefined' ? window['__dialog_win_close_cb_' + thisLevel] : undefined}
          >
            {page}
          </PageModal>
        )}
      </PageStackProvider>
    )
  })
}
