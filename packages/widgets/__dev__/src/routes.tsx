import { lazy } from 'react'

import { useRoutes } from 'react-router-dom'

import Home from './widgets/Home'
import JGWorkFlowGraph from './widgets/JGWorkFlowGraph'

const JGAttachment = lazy(() => import('./widgets/JGAttachment'))
const JGButton = lazy(() => import('./widgets/JGButton'))
const JGCheckBox = lazy(() => import('./widgets/JGCheckBox'))
const JGCheckBoxGroup = lazy(() => import('./widgets/JGCheckBoxGroup'))
const JGComboBox = lazy(() => import('./widgets/JGComboBox'))
const JGDateTimePicker = lazy(() => import('./widgets/JGDateTimePicker'))
const JGFloatBox = lazy(() => import('./widgets/JGFloatBox'))
const JGImage = lazy(() => import('./widgets/JGImage'))
const JGIntegerBox = lazy(() => import('./widgets/JGIntegerBox'))
const JGLabel = lazy(() => import('./widgets/JGLabel'))
const JGLocateBox = lazy(() => import('./widgets/JGLocateBox'))
const JGLongDateTimePicker = lazy(
  () => import('./widgets/JGLongDateTimePicker')
)
const JGLongTextBox = lazy(() => import('./widgets/JGLongTextBox'))
const JGNewList = lazy(() => import('./widgets/JGNewList'))
const JGPassword = lazy(() => import('./widgets/JGPassword'))
const JGPercent = lazy(() => import('./widgets/JGPercent'))
const JGPeriod = lazy(() => import('./widgets/JGPeriod'))
const JGPortal = lazy(() => import('./widgets/JGPortal'))
const JGRadioGroup = lazy(() => import('./widgets/JGRadioGroup'))
const JGRecordPaging = lazy(() => import('./widgets/JGRecordPaging'))
const JGSteps = lazy(() => import('./widgets/JGSteps'))
const JGTabControl = lazy(() => import('./widgets/JGTabControl'))
const JGTextBox = lazy(() => import('./widgets/JGTextBox'))
const JGFormLayout = lazy(() => import('./widgets/JGFormLayout'))
const JGQueryConditionPanel = lazy(
  () => import('./widgets/JGQueryConditionPanel')
)
const JGQrcode = lazy(() => import('./widgets/JGQrcode'))
const JGBarcode = lazy(() => import('./widgets/JGBarcode'))
const JGStartMenu = lazy(() => import('./widgets/JGStartMenu'))
const JGDropdownMenu = lazy(() => import('./widgets/JGDropdownMenu'))
const JGLinkLabel = lazy(() => import('./widgets/JGLinkLabel'))
const JGNavigator = lazy(() => import('./widgets/JGNavigator'))
const JGWebBrowser = lazy(() => import('./widgets/JGWebBrowser'))
const JGPortalEdit = lazy(() => import('./widgets/JGPortalEdit'))
const JGDiv = lazy(() => import('./widgets/JGDiv'))
const JGGroupPanel = lazy(() => import('./widgets/JGGroupPanel'))
const JGHyperLink = lazy(() => import('./widgets/JGHyperLink'))
const JGBaseDictBox = lazy(() => import('./widgets/JGBaseDictBox'))
const JGChart = lazy(() => import('./widgets/JGChart'))
const JGImageCutter = lazy(() => import('./widgets/JGImageCutter'))
const JGDataGrid = lazy(() => import('./widgets/JGDataGrid'))
const JGTreeView = lazy(() => import('./widgets/JGTreeView'))
const JGGroupPanelSecene1 = lazy(() => import('./widgets/JGGroupPanel/index1'))
const JGGroupPanelSecene2 = lazy(() => import('./widgets/JGGroupPanel/index2'))
const JGReport = lazy(() => import('./widgets/JGReport'))
const JGTreeGrid = lazy(() => import('./widgets/JGTreeGrid'))
const JGComponentContainer = lazy(
  () => import('./widgets/JGComponentContainer')
)

const JGButtonGroup = lazy(() => import('./widgets/JGButtonGroup'))

const JGRichTextEditor = lazy(() => import('./widgets/JGRichTextEditor'))
const JGRichTextViewer = lazy(() => import('./widgets/JGRichTextViewer'))
const JGPagination = lazy(() => import('./widgets/JGPagination'))
const JGImagePlay = lazy(() => import('./widgets/JGImagePlay'))
const JGCollapse = lazy(() => import('./widgets/JGCollapse'))
const IPrototypeLogin = lazy(() => import('./widgets/IPrototypeLogin'))
const IPrototypeFrame = lazy(() => import('./widgets/IPrototypeFrame'))
const JGDateRangePicker = lazy(() => import('./widgets/JGDateRangePicker'))
const JGPeriodRange = lazy(() => import('./widgets/JGPeriodRange'))
const JGToolbar = lazy(() => import('./widgets/JGToolbar'))

const Routes = () =>
  useRoutes([
    { path: '/JGToolbar', element: <JGToolbar /> },
    { path: '/JGPeriodRange', element: <JGPeriodRange /> },
    { path: '/JGDateRangePicker', element: <JGDateRangePicker /> },
    { path: '/JGRichTextEditor', element: <JGRichTextEditor /> },
    { path: '/JGButtonGroup', element: <JGButtonGroup /> },
    { path: '/JGComponentContainer', element: <JGComponentContainer /> },
    { path: '/JGTreeGrid', element: <JGTreeGrid /> },
    { path: '/JGDataGrid', element: <JGDataGrid /> },
    { path: '/JGTreeView', element: <JGTreeView /> },
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/JGButton',
      element: <JGButton />
    },
    {
      path: '/JGLabel',
      element: <JGLabel />
    },
    {
      path: '/JGImage',
      element: <JGImage />
    },
    {
      path: '/JGTextBox',
      element: <JGTextBox />
    },
    {
      path: '/JGNewList',
      element: <JGNewList />
    },
    {
      path: '/JGPortal',
      element: <JGPortal />
    },
    {
      path: '/JGRecordPaging',
      element: <JGRecordPaging />
    },
    {
      path: '/JGSteps',
      element: <JGSteps />
    },
    {
      path: '/JGFloatBox',
      element: <JGFloatBox />
    },
    {
      path: '/JGPassword',
      element: <JGPassword />
    },
    {
      path: '/JGIntegerBox',
      element: <JGIntegerBox />
    },
    {
      path: '/JGAttachment',
      element: <JGAttachment />
    },
    {
      path: '/JGPeriod',
      element: <JGPeriod />
    },
    {
      path: '/JGTabControl',
      element: <JGTabControl />
    },

    {
      path: '/JGCheckBox',
      element: <JGCheckBox />
    },
    {
      path: '/JGDateTimePicker',
      element: <JGDateTimePicker />
    },
    {
      path: '/JGLongDateTimePicker',
      element: <JGLongDateTimePicker />
    },
    {
      path: '/JGLocateBox',
      element: <JGLocateBox />
    },
    {
      path: '/JGTabControl',
      element: <JGTabControl />
    },
    {
      path: '/JGComboBox',
      element: <JGComboBox />
    },
    {
      path: '/JGCheckBoxGroup',
      element: <JGCheckBoxGroup />
    },
    {
      path: '/JGRadioGroup',
      element: <JGRadioGroup />
    },
    {
      path: '/JGPercent',
      element: <JGPercent />
    },
    {
      path: '/JGNavigator',
      element: <JGNavigator />
    },
    {
      path: '/JGDropdownMenu',
      element: <JGDropdownMenu />
    },
    {
      path: '/JGFormLayout',
      element: <JGFormLayout />
    },
    {
      path: '/JGQueryConditionPanel',
      element: <JGQueryConditionPanel />
    },
    {
      path: '/JGQrcode',
      element: <JGQrcode />
    },
    {
      path: '/JGBarcode',
      element: <JGBarcode />
    },
    {
      path: '/JGStartMenu',
      element: <JGStartMenu />
    },
    {
      path: '/JGLinkLabel',
      element: <JGLinkLabel />
    },
    {
      path: '/JGWebBrowser',
      element: <JGWebBrowser />
    },
    {
      path: '/JGPortalEdit',
      element: <JGPortalEdit />
    },
    {
      path: '/JGDiv',
      element: <JGDiv />
    },
    {
      path: '/JGGroupPanel',
      element: <JGGroupPanel />
    },
    {
      path: '/JGHyperLink',
      element: <JGHyperLink />
    },
    {
      path: '/JGBaseDictBox',
      element: <JGBaseDictBox />
    },
    {
      path: '/JGChart',
      element: <JGChart />
    },
    {
      path: '/JGImageCutter',
      element: <JGImageCutter />
    },
    {
      path: '/JGGroupPanelSecene1',
      element: <JGGroupPanelSecene1 />
    },
    {
      path: '/JGGroupPanelSecene2',
      element: <JGGroupPanelSecene2 />
    },
    {
      path: '/JGReport',
      element: <JGReport />
    },
    {
      path: '/JGLongTextBox',
      element: <JGLongTextBox />
    },
    {
      path: '/JGWorkFlowGraph',
      element: <JGWorkFlowGraph />
    },
    {
      path: 'JGRichTextEditor',
      element: <JGRichTextEditor />
    },
    {
      path: 'JGRichTextViewer',
      element: <JGRichTextViewer />
    },
    {
      path: 'JGPagination',
      element: <JGPagination />
    },
    {
      path: 'JGPagination',
      element: <JGPagination />
    },
    {
      path: 'JGImagePlay',
      element: <JGImagePlay />
    },
    {
      path: 'JGCollapse',
      element: <JGCollapse />
    },
    {
      path: 'IPrototypeLogin',
      element: <IPrototypeLogin />
    },
    {
      path: 'IPrototypeFrame',
      element: <IPrototypeFrame />
    }
  ])

export default Routes
