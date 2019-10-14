export default {
    alert: [{
        title: "粘贴入已有JSON或GO生成结构体",
        description: "tips：1.若无已有JSON或GO情况请跳过该步骤，直接进入下一页；2.复杂JSON结构可能生成有误，请手动在右侧排查；3.暂不支持Go内联类型定义；4.下一页中修改结构体"
    },
    {
        title: "修改当前结构体以生成JSON假数据",
        description: "tips：1.首个结构至少保留一个参数；2.参数的数据类型下拉框中可以手动输入自定义类型；3.可设置对每个参数设置是否必要和备注；4.嵌套深度有限制，请勿循环嵌套；5.不支持自身嵌套；6.下一页中修改JSON数据细节"
    },
    {
        title: "点击左侧节点修改JSON数据细节",
        description: "tips：1.焦点离开输入框或者点击Enter键时生效修改，可在左侧看到修改结果；2.个别值暂时不支持修改；3.下一页中进行更多操作"
    },
    {
        title: "选择需要的数据进行操作",
        description: "tips：未完成待续"
    }],
    NestNum: 10, //最大嵌套层数
    basisTypes: {
        int: `0`,
        int64: `12345678910`,
        float64: `12.34`,
        bool: `true`,
        string: `"testString"`,
        "time.Time": `"2019-9-25T19:14:43Z"`,
        "[]int": `[1, 2, 3, 4, 5]`,
        "[]int64": `[12345678911, 12345678912, 12345678913]`,
        "[]string": `["a", "b", "c", "d", "e"]`
    },//基础数据类型样例
    template: `{
        "code": 0,
        "message": "testString",
        "data": [
            {
                "updateTime": 12345678910
            }
        ]
}`//模板
}