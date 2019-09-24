<template>
    <div id="structure-input">
        <div class="backLists" v-for="(backList,index) in backLists" :key="index">
            <div class="backList-name">
                <el-input v-model="backList.name">
                    <template slot="prepend">结构名</template>
                </el-input>
                <el-button icon="el-icon-delete-solid" v-if="index!==0" @click="delList(index)"></el-button>
            </div>
            <div class="value" v-for="(item,itemIndex) in backList.data" :key="itemIndex">
                <el-input class="value-input" v-model="item.input" placeholder="字段名"></el-input>
                <el-select
                    class="value-type"
                    v-model="item.type"
                    @change="typeChange(index,itemIndex)"
                    placeholder="数据类型"
                >
                    <el-option v-for="option in options" :key="option" :value="option"></el-option>
                </el-select>
                <el-input
                    class="value-child"
                    v-model="item.child"
                    v-if="Object.keys(config.complexTypes).includes(item.type)"
                    placeholder="子结构名"
                ></el-input>
                <el-button class="del-btn" icon="el-icon-delete" @click="delValue(index,itemIndex)"></el-button>
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
    data() {
        return {
            config,
            options: [],
            backListItem: {
                input: "",
                type: "",
                child: ""
            },
            backListsItem: {
                name: "data",
                data: [
                    {
                        input: "",
                        type: "",
                        child: ""
                    }
                ]
            },
            types: { ...config.basisTypes, ...config.complexTypes },
            backLists: []
        };
    },
    watch: {
        backLists: {
            handler(newValue, oldValue) {
                if (!this.backLists[0]) {
                    return;
                }
                let data = JSON.parse(
                    this.transform(this.backLists[0].data, config.responeType)
                );
                this.$emit("setJson", data);
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {
        this.options = [
            ...Object.keys(config.basisTypes),
            ...Object.keys(config.complexTypes)
        ];
        this.backLists.push(config.template);
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
        addList() {
            this.backLists.push(this.newOBJ(this.backListsItem));
        },
        delList(index) {
            this.backLists.splice(index, 1);
        },
        typeChange(index, itemIndex) {
            this.backLists[index].data[itemIndex].child = "";
        },
        newOBJ(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        transform(data, type, index = 0) {
            if (index > config.NestNum) {
                this.$message.error(`嵌套最多${index}层, 请勿循环嵌套`);
                return;
            }
            if (!data) {
                return;
            }
            let str = "";
            data.forEach(item => {
                if (item.input) {
                    if (Object.keys(config.basisTypes).includes(item.type)) {
                        str += `"${item.input}":${this.types[item.type]},`;
                    } else if (
                        Object.keys(config.complexTypes).includes(item.type)
                    ) {
                        index++;
                        let childStr = this.transform(
                            this.findInList(item.child, index),
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
                    str = str ? `[{${str}}]` : "";
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
#structure-input {
    display: flex;
    flex-direction: column;
    .value {
        display: flex;
        border-radius: 5px;
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