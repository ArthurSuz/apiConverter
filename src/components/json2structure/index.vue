<template>
    <div id="json2structure">
        <div class="tools">
            <el-select v-model="dataType" placeholder="请选择" @change="changeType">
                <el-option label="JSON类型" value="JSON"></el-option>
                <el-option label="GO类型" value="GO"></el-option>
            </el-select>
            <el-button-group class="btn-group" v-if="dataType === 'JSON'">
                <el-button size="mini" icon="el-icon-refresh-left" @click="reset">Reset</el-button>
                <el-button size="mini" icon="el-icon-finished" @click="align">JSON Align</el-button>
            </el-button-group>
            <el-alert
                class="alert"
                :title="`${showWarning?'非':''}标准${dataType}格式`"
                :type="showWarning?'warning':'success'"
                :closable="false"
                show-icon
                center
            ></el-alert>
        </div>
        <el-input
            id="jsonInput"
            class="jsonInput"
            @keydown.tab.native="pressTab"
            :autosize="{minRows: 10, maxRows: 25}"
            type="textarea"
            v-model="text"
        ></el-input>
    </div>
</template>
<script>
import config from "@/config";

export default {
    name: "json2structure",
    data() {
        return {
            text: "",
            showWarning: false,
            dataType: "JSON"
        };
    },
    watch: {
        text: function(newValue) {
            this.setStructureText(newValue);
        }
    },
    mounted() {
        this.reset();
    },
    methods: {
        setStructureText(data) {
            this.$store
                .dispatch("setStructureText", {
                    data,
                    dataType: this.dataType
                })
                .then(() => {
                    this.showWarning = false;
                })
                .catch(() => {
                    this.showWarning = true;
                });
        },
        changeType() {
            this.setStructureText(this.text);
        },
        reset() {
            this.text = config.template;
        },
        align() {
            this.text = JSON.stringify(JSON.parse(this.text), null, 4);
        },
        //将tab事件转换为添加4个空格
        async pressTab(e) {
            let jsonInput = document.querySelector("#jsonInput");
            let startPos = jsonInput.selectionStart;
            let endPos = jsonInput.selectionEnd;
            let myValue = `    `; //四个空格
            this.text =
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
        & /deep/ .el-select {
            min-width: 120px;
        }
    }
    .jsonInput /deep/ .el-textarea__inner {
        border: 1px #dcdfe6 solid;
    }
}
</style>