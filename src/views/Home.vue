<template>
    <div id="home">
        <div class="stepBtn-group">
            <el-button icon="el-icon-arrow-left" @click="preStep" :disabled="stepActive===0">Back</el-button>
            <el-steps class="step" :active="stepActive" align-center finish-status="success">
                <el-step title="First" description="Json | Go->Structure"></el-step>
                <el-step title="Second" description="Structure->Json"></el-step>
                <el-step title="Third" description="Json<-modify"></el-step>
            </el-steps>
            <el-button @click="nextStep" :disabled="stepActive===3">Next<i class="el-icon-arrow-right" /></el-button>
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
import config from "@/config";

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
            handler(newVal) {
                this.alert = config.alert[newVal];
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