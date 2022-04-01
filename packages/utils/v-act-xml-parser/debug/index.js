const parser = require('../dist/index')

const xml = `<root>
<evaluateRule code="BR_ShowMessage1"/>
<if>
	<define>
		<expression>True</expression>
	</define>
	<sequence>
		<evaluateRule code="BR_ShowMessage2"/>
		<if>
            <define>
                <expression>False</expression>
            </define>
            <sequence>
                <evaluateRule code="BR_ShowMessage6"/>
            </sequence>
        </if>
        <else>
            <sequence>
                <foreach>
                    <define>
                        <varCode>var1</varCode>
                        <entityType>window</entityType>
                        <entityCode>ds</entityCode>
                    </define>
                    <sequence>
                        <evaluateRule code="BR_ShowMessage7"/>
                    </sequence>
                </foreach>
            </sequence>
        </else>
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

<if>
    <define>
        <expression>False</expression>
    </define>
    <sequence>
        <evaluateRule code="BR_ShowMessage5"/>
    </sequence>
</if>

<if>
    <define>
        <expression>True</expression>
    </define>
    <sequence>
        <evaluateRule code="BR_ShowMessage9"/>
    </sequence>
</if>

<evaluateRule code="BR_ShowMessage10"/>
<root>
`
const dom = parser.parse(xml)

console.log(parser.run(dom[0].children))
