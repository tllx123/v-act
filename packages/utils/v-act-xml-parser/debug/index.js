const parser = require('../dist/index')

const xml = `<root>
<evaluateRule code="BR_ShowMessage1"/>
<if>
	<define>
		<expression>True</expression>
	</define>
	<sequence>
		<evaluateRule code="BR_ShowMessage2"/>
	</sequence>
</if>
<else>
	<sequence>
		<evaluateRule code="BR_ShowMessage3"/>
	</sequence>
</else>
<foreach>
	<define>
		<varCode>var1</varCode>
		<entityType>window</entityType>
		<entityCode>ds</entityCode>
	</define>
	<sequence>
		<evaluateRule code="BR_ShowMessage4"/>
	</sequence>
</foreach>
<evaluateRule code="BR_ShowMessage5"/><root>`
const dom = parser.parse(xml)

parser.run(dom[0].children)
