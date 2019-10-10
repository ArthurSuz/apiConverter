<template>
    <div id="home">
        <div class="steps">
            <el-steps :active="stepActive" align-center finish-status="success">
                <el-step title="JSON to Structure"></el-step>
                <el-step title="Structure to JSON"></el-step>
                <el-step title="JSON self modification"></el-step>
            </el-steps>
        </div>
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
            jsonAFC: ""
        };
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
            // margin-left: 15px;
            padding-left: 15px;
            padding-right: 0;
            border-left: 1px solid #dcdfe6;
        }
    }
}
</style>