import logo from './img/logo.svg'
import './css/intro.module.css'
import { useTranslation } from '@v-act/i18n'
import { Theme, useTheme } from '@v-act/styles'

function Intro() {
  const { t } = useTranslation()
  const theme: Theme = useTheme()
  const {
    text: { color }
  } = theme
  return (
    <div className="demo">
      <div className="content" style={{ color: color, borderColor: color }}>
        <img src={logo.src} className="logo" alt="logo" />
        <h1>{t('welcome')}</h1>
        <p>
          {t('edit')}&nbsp;<code>pages/intro/Index.tsx</code>&nbsp;{t('start')}
        </p>
        <a
          className="link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('study')}
        </a>
      </div>
    </div>
  )
}

export default Intro
