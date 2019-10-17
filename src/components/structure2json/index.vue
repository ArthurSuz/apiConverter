<template>
    <div id="structure2json">
        <div class="backLists" v-for="(backList,index) in backLists" :key="index">
            <div class="backList-name">
                <el-button
                    icon="el-icon-unlock"
                    v-if="!valueArr.includes(index)"
                    @click="hiddenValue(index)"
                ></el-button>
                <el-button icon="el-icon-lock" v-else @click="showValue(index)"></el-button>
                <el-input v-model="backList.name">
                    <template slot="prepend">结构名</template>
                </el-input>
                <el-select v-model="backList.type" placeholder="结构类型">
                    <el-option label="[数组]" value="list"></el-option>
                    <el-option label="{对象}" value="obj"></el-option>
                </el-select>
                <el-button icon="el-icon-delete-solid" v-if="index!==0" @click="delList(index)"></el-button>
            </div>
            <template v-if="!valueArr.includes(index)">
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
                                v-if="!configArr.includes(`${index}-${itemIndex}`)"
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
                    <div class="value-config" v-if="configArr.includes(`${index}-${itemIndex}`)">
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
            </template>
        </div>
        <el-button class="add-value" icon="el-icon-circle-plus" @click="addList">添加结构</el-button>
    </div>
</template>

<script>
import config from "@/config";

export default {
    name: "structure2json",
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
            backLists: [],
            configArr: [],
            valueArr: []
        };
    },
    computed: {
        structureText: function() {
            return this.$store.getters.getStructureText;
        }
    },
    watch: {
        backLists: {
            handler(newValue) {
                if (this.backLists[0]) {
                    this.$store.commit("updateBackLists", newValue);
                }
            },
            immediate: true,
            deep: true
        },
        structureText: function(newValue) {
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
            this.configArr.push(`${index}-${itemIndex}`);
        },
        hiddenValue(index) {
            this.valueArr.push(index);
        },
        hiddenConfig(index, itemIndex) {
            this.configArr = this.configArr.filter(item => {
                return item !== `${index}-${itemIndex}`;
            });
        },
        showValue(index) {
            this.valueArr = this.valueArr.filter(item => {
                return item !== index;
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
        }
    }
};
</script>

<style lang="less" scoped>
#structure2json {
    display: flex;
    flex-direction: column;
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