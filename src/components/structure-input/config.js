export default {
    NestNum: 10, //最大嵌套层数
    basisTypes: {
        Int: `0`,
        Int64: `1928475`,
        Date: `"2019-09-21"`,
        String: `"test"`,
        timestamp: `1569054307819`,
        "List<int>": `[1, 2, 3, 4, 5]`,
        "List<string>": `["a", "b", "c", "d", "e"]`
    },//基础数据类型样例
    complexTypes: {
        "List<Obj>": `[{}]`,
        Obj: `{}`
    },//组合数据类型样例
    responeType: "Obj",//接口返回类型
    template: {
        name: "respone",
        data: [
            {
                input: "code",
                type: "Int",
                child: ""
            },
            {
                input: "message",
                type: "String",
                child: ""
            },
            {
                input: "data",
                type: "Obj",
                child: "",
            }
        ]
    },//模版数据
    color: ['#', '#001f3f', '#0074D9', '#7FDBFF', '#39CCCC', '#3D9970', '#2ECC40', '#01FF70', '#FFDC00', '#FF851B', '#FF4136', '#85144b', '#F012BE', '#B10DC9', '#111111', '#AAAAAA', '#DDDDDD']
}
