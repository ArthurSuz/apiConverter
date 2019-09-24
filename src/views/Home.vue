<template>
    <div id="home">
        <div class="steps">
            <el-steps :active="stepActive" finish-status="success" simple>
                <el-step title="基本数据"></el-step>
                <el-step title="详细编辑"></el-step>
                <el-step title="工具库选择"></el-step>
            </el-steps>
        </div>
        <div class="all-pane">
            <div class="pane" :class="{show: [0].includes(stepActive)}">
                <structure-input @setJson="setJson" />
            </div>
            <div class="pane" :class="{show: [0,1].includes(stepActive)}">
                <json-show
                    :jsonText="jsonText"
                    @setText="setText"
                    @nextStep="nextStep"
                    @preStep="preStep"
                    :stepActive="stepActive"
                />
            </div>
            <div class="pane" :class="{show: [1,2].includes(stepActive)}">
                <json-edit
                    :jsonData="jsonData"
                    @nextStep="nextStep"
                    @preStep="preStep"
                    :stepActive="stepActive"
                />
            </div>
            <div class="pane" :class="{show: [2,3].includes(stepActive)}">
                TODO
            </div>
        </div>
    </div>
</template>

<script>
import JsonShow from "@/components/json-show";
import StructureInput from "@/components/structure-input";
import JsonEdit from "@/components/json-edit";

export default {
    name: "home",
    components: {
        JsonShow,
        StructureInput,
        JsonEdit
    },
    data() {
        return {
            stepActive: 0,
            jsonText: "",
            jsonData: ""
        };
    },
    methods: {
        setJson(jsonText) {
            this.jsonText = jsonText;
        },
        setText(jsonData) {
            this.jsonData = jsonData;
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
        flex-wrap: wrap;
        margin-top: 20px;
        .pane {
            width: 0;
            overflow: hidden;
            transition: 0.5s;
        }
        .show {
            flex: 1;
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