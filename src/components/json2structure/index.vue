<template>
    <div id="json2structure">
        <el-button-group class="btn-group">
            <el-button size="mini" icon="el-icon-refresh-left" @click="reset">Reset</el-button>
            <el-button size="mini" icon="el-icon-finished" @click="align">JSON Align</el-button>
        </el-button-group>
        <el-alert
            v-show="showWarning"
            :title="errMessage"
            type="warning"
            :closable="false"
            show-icon
            center
        ></el-alert>
        <el-input :autosize="{minRows: 10, maxRows: 25}" type="textarea" v-model="jsonText"></el-input>
    </div>
</template>
<script>
import { jsonToGo, jsonToStruct } from "@/utils/format.js";
import config from "./config";

export default {
    name: "json2structure",
    data() {
        return {
            jsonText: "",
            jsonData: "",
            showWarning: false,
            errMessage: "非标准JSON"
        };
    },
    watch: {
        jsonText: function(newValue, oldValue) {
            this.jsonData = this.transform(newValue);
        },
        jsonData: function(newValue, oldValue) {
            if (JSON.stringify(newValue) === "[]" || !newValue) {
                this.showWarning = true;
                this.errMessage = "非标准JSON";
                this.jsonData = "";
                return;
            }
            this.$emit("setStructure", newValue);
        }
    },
    mounted() {
        this.reset();
    },
    methods: {
        reset() {
            this.jsonText = config.template;
        },
        align() {
            this.jsonText = JSON.stringify(JSON.parse(this.jsonText), null, 4);
        },
        transform(data) {
            try {
                if (JSON.stringify(data) === `"{}"`) {
                    this.errMessage = "JSON不可为空";
                    throw "";
                }
                let obj = JSON.parse(
                    `{${jsonToStruct(data, "Respone").go}}`
                        .replace(/,}/g, "}")
                        .replace('"[]":{', '[]":{')
                        .replace('"":{', '":{')
                );
                let arr = [];
                let arrList = [];
                Object.keys(obj).forEach(key => {
                    let params = {};
                    if (key.includes("[]") || arrList.includes(key)) {
                        params = {
                            name: key.replace("[]", ""),
                            type: "list",
                            data: []
                        };
                    } else {
                        params = {
                            name: key,
                            type: "obj",
                            data: []
                        };
                    }
                    Object.keys(obj[key]).forEach(key2 => {
                        let type = obj[key][key2];
                        if (`[]${key2}` === type) {
                            type = key2;
                            arrList.push(key2);
                        }
                        params.data.push({
                            input: key2,
                            type,
                            need: "true",
                            remark: ""
                        });
                    });
                    arr.push(params);
                });
                this.showWarning = false;
                return arr;
            } catch {
                this.showWarning = true;
            }
        }
    }
};
</script>
<style lang="less" scoped>
#json2structure {
    .btn-group {
        margin-bottom: 10px;
    }
}
</style>