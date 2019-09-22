<template>
    <div id="home">
        <el-card class="pane back">
            <div class="backLists" v-for="(backList,index) in backLists" :key="index">
                <el-input v-model="backList.name" @change="change">
                    <template slot="prepend">结构名</template>
                </el-input>
                <div class="value" v-for="(item,index) in backList.data" :key="index">
                    <el-input v-model="item.input" @change="change" placeholder="字段"></el-input>
                    <el-select v-model="item.type" @change="change" placeholder="数据类型">
                        <el-option v-for="option in options" :key="option" :value="option"></el-option>
                    </el-select>
                </div>
                <el-button class="add-value" @click="addValue(index)">添加字段+</el-button>
            </div>
            <el-button class="add-value" @click="addList">添加结构+</el-button>
        </el-card>
        <el-card class="pane front">
            <div class="config">
                <div>
                    <label>折叠层数:</label>
                    <el-input-number
                        v-model="deep"
                        controls-position="right"
                        :min="1"
                        :max="10"
                        size="small"
                    ></el-input-number>
                </div>
                <el-switch v-model="showDoubleQuotes" active-text="标准JOSN" inactive-text="去双引号"></el-switch>
            </div>
            <vue-json-pretty
                :showDoubleQuotes="showDoubleQuotes"
                :highlightMouseoverNode="true"
                :showLength="true"
                :deep="deep"
                :data="jsonText"
            ></vue-json-pretty>
        </el-card>
    </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
const NestNum = 10; //嵌套层数
const basisTypes = {
    Int: `0`,
    Date: `"2019-09-21"`,
    String: `"test"`,
    "List<int>": `[1, 2, 3, 4, 5]`,
    "List<string>": `["a", "b", "c", "d", "e"]`,
    timestamp: `1569054307819`
};
const complexTypes = {
    "List<Obj>": `[{}]`,
    Obj: `{}`
};
const responeType = "Obj";
const template = {
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
};
export default {
    name: "home",
    components: {
        VueJsonPretty
    },
    data() {
        return {
            options: [],
            backListItem: {
                input: "",
                type: ""
            },
            backListsItem: {
                name: "data",
                data: [
                    {
                        input: "",
                        type: ""
                    }
                ]
            },
            types: { ...basisTypes, ...complexTypes },
            backLists: [],
            jsonText: "",
            showDoubleQuotes: true,
            deep: 3
        };
    },
    mounted() {
        this.options = [
            ...Object.keys(basisTypes),
            ...Object.keys(complexTypes)
        ];
        this.backLists.push(template);
        this.change();
    },
    methods: {
        change() {
            if (this.backLists[0]) {
                this.jsonText = JSON.parse(
                    this.transform(this.backLists[0].data, responeType)
                );
            }
        },
        addValue(index) {
            this.backLists[index].data.push(this.newOBJ(this.backListItem));
        },
        addList() {
            this.backLists.push(this.newOBJ(this.backListsItem));
        },
        newOBJ(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        transform(data, type, index = 0) {
            if (index > NestNum) {
                this.$message.error(`嵌套最多${index}层, 请勿循环嵌套`);
                return;
            }
            if (!data) {
                return;
            }
            let str = "";
            data.forEach(item => {
                if (item.input) {
                    if (Object.keys(basisTypes).includes(item.type)) {
                        str += `"${item.input}":${this.types[item.type]},`;
                    } else if (Object.keys(complexTypes).includes(item.type)) {
                        index++;
                        let childStr = this.transform(
                            this.findInList(item.input, index),
                            item.type,
                            index
                        );
                        str += `"${item.input}":${childStr ||
                            this.types[item.type]},`;
                    }
                }
            });
            switch (type) {
                case "Obj":
                    str = str ? `{${str}}` : "";
                    break;
                case "List<Obj>":
                    str = str ? `[{${str}},{${str}},{${str}}]` : "";
                    break;
            }
            return str.replace(/,}/g, "}");
        },
        findInList(name, index) {
            let res = this.backLists.slice(index).find(item => {
                return item.name === name;
            });
            return res && res.data;
        }
    }
};
</script>

<style lang="less" scoped>
#home {
    display: flex;
    .pane {
        flex: 1;
        margin: 0 10px;
    }
    .back {
        display: flex;
        flex-direction: column;
        .value {
            display: flex;
        }
        .add-value {
            width: 100%;
        }
        .backLists {
            margin-bottom: 20px;
            border: 1px #909399 solid;
            border-radius: 5px;
        }
    }
    .front {
        .config {
            display: flex;
            align-items: center;
            justify-content: space-around;
        }
    }
}
</style>