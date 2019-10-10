<template>
    <div id="json2json">
        <div class="item-pane">
            <div class="btn-group">
                <div>
                    <el-button
                        size="mini"
                        icon="el-icon-arrow-left"
                        @click="goBack"
                        v-if="stepActive===2"
                    >Previous</el-button>
                </div>
                <div>
                    <el-button size="mini" @click="goNext" v-if="stepActive===1">
                        Next
                        <i class="el-icon-arrow-right"></i>
                    </el-button>
                </div>
            </div>
            <vue-json-pretty
                :highlightMouseoverNode="true"
                :showLength="true"
                :deep="3"
                :data="jsonBFC"
                v-model="selectItemKeys"
                @click="selectPath"
                selectableType="single"
                path="root"
            ></vue-json-pretty>
        </div>
        <div class="item-pane" v-if="stepActive===2">
            <div class="btn-group">
                <div></div>
                <el-button-group>
                    <el-button size="mini" @click="goNext">
                        Finish
                        <i class="el-icon-arrow-right"></i>
                    </el-button>
                </el-button-group>
            </div>
            <el-alert
                :style="`margin-top:${alertMarginTop}px`"
                :title="alertData.title"
                :type="alertData.type"
                :description="alertData.description"
                :closable="false"
                show-icon
                effect="dark"
            ></el-alert>
            <div class="change-input">
                <el-input
                    v-model="selectItemVal"
                    @change="setJsonData"
                    v-if="selectType === '[object String]'"
                ></el-input>
                <el-input-number
                    style="width: 100%"
                    v-model="selectItemVal"
                    @change="setJsonData"
                    v-else-if="selectType === '[object Number]'"
                    controls-position="right"
                ></el-input-number>
                <el-switch
                    v-model="selectItemVal"
                    @change="setJsonData"
                    active-text="true"
                    inactive-text="false"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    v-else-if="selectType === '[object Boolean]'"
                ></el-switch>
                <el-button-group class="btn-group" v-else-if="selectType === '[object Array]'">
                    <el-button
                        class="btn"
                        type="success"
                        icon="el-icon-plus"
                        @click="setJsonData('add')"
                    >复制第一个元素</el-button>
                    <el-button
                        class="btn"
                        type="danger"
                        icon="el-icon-minus"
                        @click="setJsonData('del')"
                    >删除最后一个元素</el-button>
                </el-button-group>
            </div>
        </div>
    </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
export default {
    name: "json2json",
    components: {
        VueJsonPretty
    },
    props: ["jsonBFC", "stepActive"],
    computed: {
        alertData: function() {
            let params = {
                title: "",
                type: "",
                description: ""
            };
            if (!this.selectItemKeys) {
                params.title = "提示";
                params.type = "warning";
                params.description = "请点击左侧需要修改的节点";
            } else {
                params.title = `Path: ${this.selectItemKeys}`;
                params.type = "info";
                switch (this.selectType) {
                    case "[object String]":
                        params.description = "请在下方修改字符串值";
                        break;
                    case "[object Number]":
                        params.description = "请在下方修改数字值";
                        break;
                    case "[object Boolean]":
                        params.description = "请在下方修改布尔值";
                        break;
                    case "[object Array]":
                        params.description =
                            "请在下方选择数组变更方式（点击数组内的值进行直接修改）";
                        break;
                    default:
                        params.type = "error";
                        params.description = "该节点不可修改";
                        break;
                }
            }
            return params;
        }
    },
    watch: {
        jsonBFC: function(newValue, oldValue) {
            this.root = newValue;
            this.selectItemKeys = this.$options.selectItemKeys;
            this.selectItemVal = this.$options.selectItemVal;
            this.selectType = this.$options.selectType;
        },
        root: function(newValue, oldValue) {
            this.$emit("setJsonAFC", newValue);
        }
    },
    data() {
        return {
            root: {},
            selectItemKeys: "",
            selectItemVal: null,
            selectType: "",
            alertMarginTop: 0
        };
    },
    methods: {
        goBack() {
            this.$emit("preStep");
        },
        goNext() {
            this.$emit("nextStep");
        },
        selectPath(path, data) {
            this.alertMarginTop = window.pageYOffset;
            this.selectItemKeys = path;
            this.selectItemVal = data;
            this.selectType = Object.prototype.toString.call(data);
        },
        setJsonData(val) {
            switch (this.selectType) {
                case "[object String]":
                    let valStr = val.replace(/"/g, "'");
                    this.selectItemVal = valStr;
                    eval(`this.${this.selectItemKeys} = valStr`);
                    break;
                case "[object Number]":
                    let valNum = val || 0;
                    this.selectItemVal = valNum;
                    eval(`this.${this.selectItemKeys} = ${valNum}`);
                    break;
                case "[object Boolean]":
                    eval(`this.${this.selectItemKeys} = ${val}`);
                    break;
                case "[object Array]":
                    if (val === "add") {
                        let newData = JSON.parse(
                            JSON.stringify(this.selectItemVal[0])
                        );
                        eval(`this.${this.selectItemKeys}.push(newData)`);
                    } else if (val === "del") {
                        if (this.selectItemVal.length > 1) {
                            eval(`this.${this.selectItemKeys}.pop()`);
                        } else {
                            this.$message.warning("至少保留一个元素");
                        }
                    }
                    break;
            }
        }
    }
};
</script>

<style lang="less" scoped>
#json2json {
    display: flex;
    .item-pane {
        flex: 1;
        overflow: hidden;
    }
    .item-pane + .item-pane {
        margin-left: 15px;
        padding-left: 15px;
        border-left: 1px solid #dcdfe6;
    }
    .btn-group {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }
    .change-input {
        margin: 10px;
    }
    .btn-group {
        width: 100%;
        flex-wrap: wrap;
        .btn {
            flex: 1;
            overflow: hidden;
        }
    }
}
</style>
<style lang="less">
#json2json {
    .btn-group {
        .btn {
            span {
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
                display: inline-block;
            }
        }
    }
}
</style>