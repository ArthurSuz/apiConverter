<template>
    <div id="json2structure">
        <div class="tools">
            <el-button-group class="btn-group">
                <el-button
                    size="mini"
                    icon="el-icon-copy-document"
                    @click="changeType"
                >切换输入格式（当前为{{dataType}})</el-button>
                <template v-if="dataType === 'JSON'">
                    <el-button size="mini" icon="el-icon-refresh-left" @click="reset">Reset</el-button>
                    <el-button size="mini" icon="el-icon-finished" @click="align">JSON Align</el-button>
                </template>
            </el-button-group>
            <el-alert
                :title="`${showWarning?'非':''}标准${dataType}格式`"
                :type="showWarning?'warning':'success'"
                :closable="false"
                show-icon
                center
            ></el-alert>
        </div>
        <el-input
            id="jsonInput"
            @keydown.tab.native="pressTab"
            :autosize="{minRows: 10, maxRows: 25}"
            type="textarea"
            v-model="jsonText"
        ></el-input>
    </div>
</template>
<script>
import { jsonToGo } from "@/utils/format.js";
import config from "@/config";

export default {
    name: "json2structure",
    data() {
        return {
            jsonText: "",
            showWarning: false,
            dataType: "JSON"
        };
    },
    watch: {
        jsonText: function(newValue, oldValue) {
            this.transform(newValue);
        }
    },
    mounted() {
        this.reset();
    },
    methods: {
        changeType() {
            this.dataType = this.dataType === "JSON" ? "GO" : "JSON";
            this.transform(this.jsonText);
        },
        reset() {
            this.jsonText = config.template;
        },
        align() {
            this.jsonText = JSON.stringify(JSON.parse(this.jsonText), null, 4);
        },
        transform(data) {
            try {
                let obj;
                switch (this.dataType) {
                    case "JSON":
                        if (
                            JSON.stringify(data).replace(/\\n|\s/g, "") ===
                            `"{}"`
                        ) {
                            throw "";
                        }
                        obj = jsonToGo(data).go;
                        break;
                    case "GO":
                        obj = data;
                        break;
                }
                let goDataArr = [];
                let goDataSp = {};
                let lastindex = 0;
                obj.trim().split("\n")
                    .forEach(e => {
                        if(!e) {
                            return;
                        }
                        let curArr = e.trim().split(" ").filter(e => e);
                        switch (curArr[0]) {
                            case "type":
                                goDataArr.push({
                                    name: curArr[1],
                                    type:
                                        /(\S*)struct/.exec(curArr[2])[1] ===
                                        "[]"
                                            ? "list"
                                            : "obj",
                                    data: []
                                });
                                break;
                            case "}":
                                lastindex++;
                                break;
                            default:
                                if (
                                    !Object.keys(config.basisTypes).includes(
                                        curArr[1]
                                    )
                                ) {
                                    if (curArr[1].includes("[]")) {
                                        goDataSp[curArr[1].replace("[]", "")] =
                                            "list";
                                    } else if (
                                        !curArr[1].includes("interface{}")
                                    ) {
                                        goDataSp[curArr[1]] = "obj";
                                    }
                                }
                                goDataArr[lastindex].data.push({
                                    input: /`json:"(\S*)"`/.exec(curArr[2])[1],
                                    need: "true",
                                    remark: "",
                                    type: curArr[1].replace("[]", "")
                                });
                                break;
                        }
                    });

                goDataArr.forEach(item => {
                    let key = Object.keys(goDataSp).find(e => e === item.name);
                    if (key) {
                        item.type = goDataSp[key];
                    }
                });
                this.showWarning = false;
                if (JSON.stringify(goDataArr) === "[]" || !goDataArr) {
                    this.showWarning = true;
                    throw "";
                }
                this.$store.commit("updateStructureText", goDataArr);
            } catch {
                this.showWarning = true;
            }
        },
        //将tab事件转换为添加4个空格
        async pressTab(e) {
            let jsonInput = document.querySelector("#jsonInput");
            let startPos = jsonInput.selectionStart;
            let endPos = jsonInput.selectionEnd;
            let myValue = `    `; //四个空格
            this.jsonText =
                jsonInput.value.substring(0, startPos) +
                myValue +
                jsonInput.value.substring(endPos, jsonInput.value.length);
            await this.$nextTick();
            jsonInput.focus();
            let newPos = startPos + myValue.length;
            jsonInput.setSelectionRange(newPos, newPos);
            e.preventDefault();
        }
    }
};
</script>
<style lang="less" scoped>
#json2structure {
    .tools {
        display: flex;
        .btn-group {
            display: flex;
            flex-wrap: nowrap;
        }
    }
}
</style>