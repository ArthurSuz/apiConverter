<template>
    <div id="json2json">
        <div class="item-pane">
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
                    ref="focusInput"
                    v-model="selectItemVal"
                    @change="setJsonData"
                    v-if="selectType === '[object String]'"
                ></el-input>
                <el-input-number
                    ref="focusInput"
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
                <div class="btn-group" v-else-if="selectType === '[object Array]'">
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
                </div>
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
    props: ["stepActive"],
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
        },
        jsonBFC: function() {
            return this.$store.getters.getJsonBFC;
        }
    },
    watch: {
        jsonBFC: function(newValue) {
            this.root = newValue;
            this.selectItemKeys = this.$options.selectItemKeys;
            this.selectItemVal = this.$options.selectItemVal;
            this.selectType = this.$options.selectType;
        },
        root: function(newValue) {
            this.$store.commit("updateJsonAFC", newValue);
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
        selectPath(path, data) {
            this.alertMarginTop = window.pageYOffset;
            this.selectItemKeys = path;
            this.selectItemVal = data;
            this.selectType = Object.prototype.toString.call(data);
            this.$nextTick(function() {
                let input = this.$refs.focusInput;
                if (input) {
                    input.focus();
                }
            });
        },
        setJsonData(val) {
            switch (this.selectType) {
                case "[object String]":
                    // eslint-disable-next-line no-case-declarations
                    let valStr = val.replace(/"/g, "'");
                    this.selectItemVal = valStr;
                    eval(`this.${this.selectItemKeys} = valStr`);
                    break;
                case "[object Number]":
                    // eslint-disable-next-line no-case-declarations
                    let valNum = val || 0;
                    this.selectItemVal = valNum;
                    eval(`this.${this.selectItemKeys} = ${valNum}`);
                    break;
                case "[object Boolean]":
                    eval(`this.${this.selectItemKeys} = ${val}`);
                    break;
                case "[object Array]":
                    if (val === "add") {
                        // eslint-disable-next-line no-unused-vars
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
    .change-input {
        margin: 10px;
    }
    .btn-group {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .btn {
            flex: 1;
            overflow: hidden;
        }
    }
}
</style>