export default {
    NestNum: 9, //最大嵌套层数
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
    }//基础数据类型样例
}