<template>
    <div id="structure-input">
        <div class="btn-group">
            <div>
                <el-button-group v-if="stepActive===1">
                    <el-button size="mini" icon="el-icon-arrow-left" @click="goBack">Previous</el-button>
                </el-button-group>
            </div>
            <div>
                <el-button-group v-if="stepActive===0">
                    <el-button size="mini" @click="goNext">
                        Next
                        <i class="el-icon-arrow-right"></i>
                    </el-button>
                </el-button-group>
            </div>
        </div>
        <div class="backLists" v-for="(backList,index) in backLists" :key="index">
            <div class="backList-name">
                <el-input v-model="backList.name">
                    <template slot="prepend">结构名</template>
                </el-input>
                <el-select v-model="backList.type" placeholder="结构类型">
                    <el-option label="[数组]" value="list"></el-option>
                    <el-option label="{对象}" value="obj"></el-option>
                </el-select>
                <el-button icon="el-icon-delete-solid" v-if="index!==0" @click="delList(index)"></el-button>
            </div>
            <div class="value" v-for="(item,itemIndex) in backList.data" :key="itemIndex">
                <div class="value-main">
                    <el-input class="value-input" v-model="item.input" placeholder="字段名"></el-input>
                    <el-select
                        class="value-type"
                        v-model="item.type"
                        filterable
                        allow-create
                        placeholder="数据类型"
                    >
                        <el-option v-for="option in options" :key="option" :value="option"></el-option>
                    </el-select>
                    <el-button-group>
                        <el-button
                            icon="el-icon-setting"
                            v-if="!showArr.includes(`${index}-${itemIndex}`)"
                            @click="showConfig(index,itemIndex)"
                        ></el-button>
                        <el-button
                            icon="el-icon-arrow-up"
                            v-else
                            @click="hiddenConfig(index,itemIndex)"
                        ></el-button>
                        <el-button icon="el-icon-delete" @click="delValue(index,itemIndex)"></el-button>
                    </el-button-group>
                </div>
                <div class="value-config" v-if="showArr.includes(`${index}-${itemIndex}`)">
                    <el-select v-model="item.need" placeholder="请选择">
                        <el-option label="必须" value="true"></el-option>
                        <el-option label="非必须" value="false"></el-option>
                    </el-select>
                    <el-input v-model="item.remark" placeholder="备注"></el-input>
                </div>
            </div>
            <el-button
                class="add-value"
                icon="el-icon-circle-plus-outline"
                @click="addValue(index)"
            >添加字段</el-button>
        </div>
        <el-button class="add-value" icon="el-icon-circle-plus" @click="addList">添加结构</el-button>
    </div>
</template>

<script>
import config from "./config";

export default {
    name: "structure-input",
    props: ["stepActive", "structureText"],
    data() {
        return {
            config,
            options: [],
            backListItem: {
                input: "",
                type: "",
                need: true,
                remark: ""
            },
            backListsItem: {
                name: "data",
                type: "obj",
                data: [
                    {
                        input: "",
                        type: "",
                        need: true,
                        remark: ""
                    }
                ]
            },
            types: { ...config.basisTypes },
            backLists: [],
            showArr: []
        };
    },
    watch: {
        backLists: {
            handler(newValue, oldValue) {
                if (!this.backLists[0]) {
                    return;
                }
                let data = JSON.parse(this.transform(this.backLists[0]));
                this.$emit("setTable", this.setTable());
                this.$emit("setJson", data);
            },
            immediate: true,
            deep: true
        },
        structureText: function(newValue, oldValue) {
            this.backLists = newValue;
        }
    },
    mounted() {
        this.options = [...Object.keys(config.basisTypes)];
    },
    methods: {
        addValue(index) {
            this.backLists[index].data.push(this.newOBJ(this.backListItem));
        },
        delValue(index, itemIndex) {
            if (index === 0 && this.backLists[index].data.length === 1) {
                this.$message.error("首个结构至少保留一个参数");
                return;
            }
            this.backLists[index].data.splice(itemIndex, 1);
        },
        showConfig(index, itemIndex) {
            this.showArr.push(`${index}-${itemIndex}`);
        },
        hiddenConfig(index, itemIndex) {
            this.showArr = this.showArr.filter(item => {
                return item !== `${index}-${itemIndex}`;
            });
        },
        addList() {
            this.backLists.push(this.newOBJ(this.backListsItem));
        },
        delList(index) {
            this.backLists.splice(index, 1);
        },
        newOBJ(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        transform(list, index = 0) {
            if (index > config.NestNum) {
                this.$message.error(`嵌套最多${index}层, 请勿循环嵌套`);
                return;
            }
            if (!list) {
                return;
            }
            let data = list.data;
            let str = "";
            data.forEach(item => {
                if (item.input) {
                    str += `"${item.input}":`;
                    if (Object.keys(config.basisTypes).includes(item.type)) {
                        str += `${this.types[item.type]},`;
                    } else if (item.type === "interface{}") {
                        str += `null,`;
                    } else {
                        index++;
                        let res = this.findInList(item.type, index);
                        let childStr = this.transform(res, index) || "null";
                        str += `${childStr},`;
                    }
                }
            });
            switch (list.type) {
                case "obj":
                    str = str ? `{${str}}` : "";
                    break;
                case "list":
                    str = str ? `[{${str}}]` : "";
                    break;
            }
            return str.replace(/,}/g, "}");
        },
        findInList(name, index) {
            // let res = this.backLists.slice(index).find(item => {
            //     return item.name === name;
            // });
            let res = this.backLists.find(item => {
                return item.name === name;
            });
            return res;
        },
        setTable() {
            let arr = [];
            this.backLists.forEach(list => {
                arr.push({ name: list.name, type: "", need: "", remark: "" });
                list.data.forEach(item => {
                    arr.push({
                        name: item.input,
                        type: item.type,
                        need: item.need,
                        remark: item.remark
                    });
                });
            });
            return arr;
        },
        goBack() {
            this.$emit("preStep");
        },
        goNext() {
            this.$emit("nextStep");
        }
    }
};
</script>

<style lang="less" scoped>
#structure-input {
    display: flex;
    flex-direction: column;
    .btn-group {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }
    .value {
        display: flex;
        flex-direction: column;
        .value-main {
            display: flex;
            .value-input {
                flex: 2;
            }
            .value-type {
                flex: 1;
            }
            .value-child {
                flex: 1;
            }
        }
        .value-config {
            display: flex;
            &::before {
                content: "⌊";
                padding: 0 5px 0 10px;
                font-size: 20px;
                font-weight: bold;
                color: #c0c4cc;
            }
        }
    }
    .add-value {
        width: 100%;
    }
    .backLists {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        border: 1px #909399 solid;
        border-radius: 5px;
    }
    .backList-name {
        display: flex;
    }
}
</style>