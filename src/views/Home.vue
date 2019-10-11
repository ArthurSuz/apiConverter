<template>
    <div id="home">
        <el-steps :active="stepActive" align-center finish-status="success">
            <el-step title="JSON to Structure"></el-step>
            <el-step title="Structure to JSON"></el-step>
            <el-step title="JSON self modification"></el-step>
        </el-steps>
        <el-alert
            class="alert"
            :title="alert.title"
            :description="alert.description"
            type="info"
            close-text="知道了"
        ></el-alert>
        <div class="all-pane">
            <div class="pane" :class="{show: [0].includes(stepActive)}">
                <json2structure @setStructure="setStructure" />
            </div>
            <div class="pane" :class="{show: [0,1].includes(stepActive)}">
                <structure2json
                    :structureText="structureText"
                    @setJsonBFC="setJsonBFC"
                    @setTable="setTable"
                    @nextStep="nextStep"
                    @preStep="preStep"
                    :stepActive="stepActive"
                />
            </div>
            <div class="pane" :class="{show: [1,2].includes(stepActive)}">
                <json2json
                    :jsonBFC="jsonBFC"
                    @setJsonAFC="setJsonAFC"
                    @nextStep="nextStep"
                    @preStep="preStep"
                    :stepActive="stepActive"
                />
            </div>
            <div class="pane" :class="{show: [3].includes(stepActive)}">
                <data-produce :tableLists="tableLists" :jsonAFC="jsonAFC" @preStep="preStep" />
            </div>
        </div>
    </div>
</template>

<script>
import json2structure from "@/components/json2structure";
import structure2json from "@/components/structure2json";
import json2json from "@/components/json2json";
import DataProduce from "@/components/data-produce";
export default {
    name: "home",
    components: {
        json2structure,
        structure2json,
        json2json,
        DataProduce
    },
    data() {
        return {
            stepActive: 0,
            structureText: "",
            jsonBFC: "",
            tableLists: [],
            jsonAFC: "",
            alert: {
                title: "",
                description: ""
            }
        };
    },
    watch: {
        stepActive: {
            handler(newVal, oldVal) {
                switch (newVal) {
                    case 0:
                        this.alert.title =
                            "粘贴入已有JSON生成结构体，点击Next开始修改结构体";
                        this.alert.description =
                            "tips：1.若无已有JSON情况请点击Next跳过该步骤；2.复杂JSON结构可能生成有误，请手动在右侧排查";
                        break;
                    case 1:
                        this.alert.title =
                            "修改当前结构体以生成JSON假数据，点击Next开始修改JSON数据细节";
                        this.alert.description =
                            "tips：1.首个结构至少保留一个参数；2.参数的数据类型下拉框中可以手动输入自定义类型；3.可设置对每个参数设置是否必要和备注；4.嵌套深度有限制，请勿循环嵌套；5.不支持自身嵌套";
                        break;
                    case 2:
                        this.alert.title =
                            "点击左侧节点修改JSON数据细节，点击Finish进行更多操作";
                        this.alert.description =
                            "tips：1.焦点离开输入框或者点击Enter键时生效修改，可在左侧看到修改结果；2.个别值暂时不支持修改";
                        break;
                    case 3:
                        this.alert.title = "选择需要的数据进行操作";
                        this.alert.description = "tips：未完成待续";
                        break;
                }
            },
            immediate: true
        }
    },
    methods: {
        setStructure(structureText) {
            this.structureText = structureText;
        },
        setJsonBFC(jsonBFC) {
            this.jsonBFC = jsonBFC;
        },
        setTable(tableLists) {
            this.tableLists = tableLists;
        },
        setJsonAFC(jsonAFC) {
            this.jsonAFC = jsonAFC;
        },
        nextStep() {
            this.stepActive += 1;
        },
        preStep() {
            this.stepActive -= 1;
        }
    }
};
</script>

<style lang="less" scoped>
#home {
    .alert {
        margin-top: 20px;
    }
    .all-pane {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        height: fit-content;
        .pane {
            width: 0;
            height: 0;
            overflow: hidden;
            transition: 0.5s;
            margin-bottom: 20px;
        }
        .show {
            flex: 1;
            height: auto;
            min-width: 300px;
            padding-right: 15px;
        }
        .show + .show {
            padding-left: 15px;
            padding-right: 0;
            border-left: 1px solid #dcdfe6;
        }
    }
}
</style>