<template>
    <div id="home">
        <div class="steps">
            <el-steps :active="stepActive" align-center>
                <el-step title="Basic"></el-step>
                <el-step title="Detail"></el-step>
                <el-step title="DoSomething"></el-step>
            </el-steps>
        </div>
        <div class="all-pane">
            <div class="pane" :class="{show: [0].includes(stepActive)}">
                <go-input @setStructure="setStructure" />
            </div>
            <div class="pane" :class="{show: [0,1].includes(stepActive)}">
                <structure-input
                    :structureText="structureText"
                    @setJson="setJson"
                    @setTable="setTable"
                    @nextStep="nextStep"
                    @preStep="preStep"
                    :stepActive="stepActive"
                />
            </div>
            <div class="pane" :class="{show: [1,2].includes(stepActive)}">
                <json-show
                    :jsonText="jsonText"
                    @setText="setText"
                    @nextStep="nextStep"
                    @preStep="preStep"
                    :stepActive="stepActive"
                />
            </div>
            <div class="pane" :class="{show: [2,3].includes(stepActive)}">
                <json-edit
                    :jsonData="jsonData"
                    @nextStep="nextStep"
                    @preStep="preStep"
                    :stepActive="stepActive"
                />
            </div>
            <div class="pane" :class="{show: [3].includes(stepActive)}">
                <data-produce :tableLists="tableLists" />
            </div>
        </div>
    </div>
</template>

<script>
import GoInput from "@/components/go-input";
import JsonShow from "@/components/json-show";
import StructureInput from "@/components/structure-input";
import JsonEdit from "@/components/json-edit";
import DataProduce from "@/components/data-produce";
export default {
    name: "home",
    components: {
        GoInput,
        JsonShow,
        StructureInput,
        JsonEdit,
        DataProduce
    },
    data() {
        return {
            stepActive: 0,
            structureText: "",
            jsonText: "",
            jsonData: "",
            tableLists: []
        };
    },
    methods: {
        setStructure(structureText) {
            this.structureText = structureText;
        },
        setJson(jsonText) {
            this.jsonText = jsonText;
        },
        setText(jsonData) {
            this.jsonData = jsonData;
        },
        setTable(tableLists) {
            this.tableLists = tableLists;
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
    .steps {
    }
    .all-pane {
        display: flex;
        // flex-wrap: wrap;
        margin-top: 20px;
        height: fit-content;
        .pane {
            width: 0;
            height: 0;
            overflow: hidden;
            transition: 0.5s;
        }
        .show {
            flex: 1;
            height: auto;
            min-width: 300px;
        }
        .show + .show {
            margin-left: 15px;
            padding-left: 15px;
            border-left: 1px solid #dcdfe6;
        }
    }
}
</style>