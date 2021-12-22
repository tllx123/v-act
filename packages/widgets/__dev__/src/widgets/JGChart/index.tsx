import { JGChart } from '@v-act/jgchart'
import { JGComponent } from '@v-act/jgcomponent'

const chart = () => {
  let setting =
    '{&quot;PluginID&quot;:&quot;FusionChart&quot;,&quot;PluginName&quot;:&quot;Fusion图表&quot;,&quot;ChartID&quot;:&quot;1013&quot;,&quot;chartName&quot;:&quot;饼2D&quot;,&quot;chartType&quot;:&quot;Pie&quot;,&quot;is3D&quot;:&quot;false&quot;,&quot;path&quot;:&quot;fusionchart/FusionchartFactory&quot;,&quot;palette&quot;:&quot;3&quot;,&quot;size&quot;:{&quot;high&quot;:&quot;400&quot;,&quot;width&quot;:&quot;600&quot;},&quot;title&quot;:{&quot;font&quot;:&quot;黑体&quot;,&quot;fontSize&quot;:&quot;32&quot;,&quot;fontColor&quot;:&quot;#FF0000&quot;,&quot;alpha&quot;:&quot;0&quot;,&quot;bgColor&quot;:null,&quot;bold&quot;:&quot;1&quot;,&quot;italic&quot;:&quot;0&quot;,&quot;strikeout&quot;:&quot;0&quot;,&quot;underline&quot;:&quot;0&quot;,&quot;show&quot;:&quot;true&quot;,&quot;horizontal&quot;:&quot;center&quot;,&quot;vertical&quot;:&quot;top&quot;,&quot;title&quot;:&quot;对不对&quot;},&quot;subtitle&quot;:{&quot;font&quot;:&quot;黑体&quot;,&quot;fontSize&quot;:&quot;12&quot;,&quot;fontColor&quot;:&quot;#000000&quot;,&quot;alpha&quot;:&quot;0&quot;,&quot;bgColor&quot;:null,&quot;bold&quot;:&quot;0&quot;,&quot;italic&quot;:&quot;0&quot;,&quot;strikeout&quot;:&quot;0&quot;,&quot;underline&quot;:&quot;0&quot;,&quot;show&quot;:&quot;true&quot;,&quot;horizontal&quot;:&quot;center&quot;,&quot;vertical&quot;:&quot;top&quot;,&quot;title&quot;:&quot;这个是副标题&quot;},&quot;inCanvas&quot;:{&quot;font&quot;:&quot;黑体&quot;,&quot;fontSize&quot;:&quot;8&quot;,&quot;fontColor&quot;:&quot;#FF0000&quot;,&quot;alpha&quot;:&quot;100&quot;,&quot;bgColor&quot;:null,&quot;bold&quot;:&quot;0&quot;,&quot;italic&quot;:&quot;0&quot;,&quot;strikeout&quot;:&quot;0&quot;,&quot;underline&quot;:&quot;0&quot;},&quot;outCanvas&quot;:{&quot;font&quot;:&quot;黑体&quot;,&quot;fontSize&quot;:&quot;8&quot;,&quot;fontColor&quot;:&quot;#00FF00&quot;,&quot;alpha&quot;:&quot;100&quot;,&quot;bgColor&quot;:null,&quot;bold&quot;:&quot;0&quot;,&quot;italic&quot;:&quot;0&quot;,&quot;strikeout&quot;:&quot;0&quot;,&quot;underline&quot;:&quot;0&quot;},&quot;xAxis&quot;:{&quot;Title&quot;:null,&quot;font&quot;:null,&quot;fontSize&quot;:&quot;0&quot;,&quot;fontColor&quot;:null,&quot;labelDisplay&quot;:null,&quot;slantLabels&quot;:null,&quot;bold&quot;:&quot;0&quot;,&quot;italic&quot;:&quot;0&quot;,&quot;strikeout&quot;:&quot;0&quot;,&quot;underline&quot;:&quot;0&quot;,&quot;boundaryGap&quot;:&quot;false&quot;,&quot;scale&quot;:&quot;false&quot;,&quot;LabelShow&quot;:&quot;true&quot;,&quot;LineShow&quot;:&quot;true&quot;,&quot;TickShow&quot;:&quot;true&quot;,&quot;alignWithLabel&quot;:&quot;true&quot;,&quot;nameGap&quot;:null,&quot;nameLocation&quot;:null},&quot;yAxis&quot;:{&quot;Title&quot;:null,&quot;font&quot;:null,&quot;fontSize&quot;:&quot;0&quot;,&quot;fontColor&quot;:null,&quot;labelDisplay&quot;:null,&quot;slantLabels&quot;:null,&quot;bold&quot;:&quot;0&quot;,&quot;italic&quot;:&quot;0&quot;,&quot;strikeout&quot;:&quot;0&quot;,&quot;underline&quot;:&quot;0&quot;,&quot;boundaryGap&quot;:&quot;false&quot;,&quot;scale&quot;:&quot;false&quot;,&quot;LabelShow&quot;:&quot;true&quot;,&quot;LineShow&quot;:&quot;true&quot;,&quot;TickShow&quot;:&quot;true&quot;,&quot;isGradientColor&quot;:&quot;false&quot;,&quot;nameGap&quot;:null,&quot;nameLocation&quot;:null},&quot;DataInfo&quot;:{&quot;type&quot;:&quot;Entity&quot;,&quot;name&quot;:&quot;test&quot;,&quot;value&quot;:&quot;test&quot;},&quot;DataColumns&quot;:{&quot;value&quot;:[&quot;id&quot;,&quot;name&quot;,&quot;num&quot;]},&quot;serie&quot;:{&quot;isVar&quot;:&quot;true&quot;,&quot;name&quot;:null,&quot;value&quot;:&quot;name&quot;,&quot;show&quot;:&quot;true&quot;,&quot;horizontal&quot;:&quot;center&quot;,&quot;vertical&quot;:&quot;bottom&quot;,&quot;orient&quot;:&quot;horizontal&quot;,&quot;itemGap&quot;:&quot;10&quot;,&quot;selectedOffset&quot;:&quot;10&quot;,&quot;selecteName&quot;:null,&quot;isShowLabel&quot;:&quot;true&quot;,&quot;isShowDataLabel&quot;:&quot;false&quot;,&quot;isShowLabelLine&quot;:&quot;true&quot;,&quot;radius&quot;:&quot;65%&quot;,&quot;center&quot;:[&quot;50%&quot;,&quot;50%&quot;]},&quot;x&quot;:{&quot;isVar&quot;:&quot;false&quot;,&quot;name&quot;:null,&quot;value&quot;:null},&quot;y&quot;:{&quot;name&quot;:&quot;num&quot;,&quot;code&quot;:&quot;num&quot;,&quot;stack&quot;:&quot;false&quot;,&quot;showlabel&quot;:&quot;false&quot;,&quot;position&quot;:&quot;top&quot;}}'
  let setting2 = setting.replaceAll('&quot;', '"')
  console.log(setting2)
  return (
    <JGComponent>
      <JGChart
        graphSettings={setting2}
        top={53}
        left={56}
        height={213}
        width={462}
      ></JGChart>
    </JGComponent>
  )
}

export default chart