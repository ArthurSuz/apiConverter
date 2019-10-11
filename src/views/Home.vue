<template>
    <div id="home">
        <div class="stepBtn-group">
            <el-button icon="el-icon-arrow-left" @click="preStep" :disabled="stepActive===0"></el-button>
            <el-steps class="step" :active="stepActive" align-center finish-status="success">
                <el-step title="First" description="Json->Structure"></el-step>
                <el-step title="Second" description="Structure->Json"></el-step>
                <el-step title="Third" description="Json<-modify"></el-step>
            </el-steps>
            <el-button icon="el-icon-arrow-right" @click="nextStep" :disabled="stepActive===3"></el-button>
        </div>
        <el-alert
            class="alert"
            :title="alert.title"
            :description="alert.description"
            type="info"
            :closable="false"
        ></el-alert>
        <div class="all-pane">
            <div class="pane" :class="{show: [0].includes(stepActive)}">
                <json2structure />
            </div>
            <div class="pane" :class="{show: [0,1].includes(stepActive)}">
                <structure2json />
            </div>
            <div class="pane" :class="{show: [1,2].includes(stepActive)}">
                <json2json :stepActive="stepActive" />
            </div>
            <div class="pane" :class="{show: [3].includes(stepActive)}">
                <data-produce />
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
                            "粘贴入已有JSON生成结构体";
                        this.alert.description =
                            "tips：1.若无已有JSON情况请跳过该步骤，直接进入下一页；2.复杂JSON结构可能生成有误，请手动在右侧排查；3.下一页中修改结构体";
                        break;
                    case 1:
                        this.alert.title =
                            "修改当前结构体以生成JSON假数据";
                        this.alert.description =
                            "tips：1.首个结构至少保留一个参数；2.参数的数据类型下拉框中可以手动输入自定义类型；3.可设置对每个参数设置是否必要和备注；4.嵌套深度有限制，请勿循环嵌套；5.不支持自身嵌套；6.下一页中修改JSON数据细节";
                        break;
                    case 2:
                        this.alert.title =
                            "点击左侧节点修改JSON数据细节";
                        this.alert.description =
                            "tips：1.焦点离开输入框或者点击Enter键时生效修改，可在左侧看到修改结果；2.个别值暂时不支持修改；3.下一页中进行更多操作";
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
    .stepBtn-group {
        width: 100%;
        display: flex;
        .step {
            width: 100%;
        }
    }
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