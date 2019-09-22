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
                type: "Int"
            },
            {
                input: "message",
                type: "String"
            },
            {
                input: "data",
                type: "Obj"
            }
        ]
    }//模版数据
}
