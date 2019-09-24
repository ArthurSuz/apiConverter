<template>
    <div id="json-edit">
        <div class="btn-group">
            <div>
                <el-button-group v-if="stepActive===2">
                    <el-button size="mini" icon="el-icon-arrow-left" @click="goBack">Previous</el-button>
                </el-button-group>
            </div>
            <div>
                <el-button-group v-if="stepActive===1">
                    <el-button
                        size="mini"
                        v-clipboard:error="onError"
                        v-clipboard:copy="JSON.stringify(showText, null, 2)"
                        v-clipboard:success="onCopy"
                        icon="el-icon-copy-document"
                    >Copy</el-button>
                    <el-button size="mini" @click="goNext">
                        Next
                        <i class="el-icon-arrow-right"></i>
                    </el-button>
                </el-button-group>
            </div>
        </div>
        <el-alert
            v-show="showWarning"
            title="非标准JSON时，视图不更新"
            type="warning"
            :closable="false"
            show-icon
            center
        ></el-alert>
        <vue-json-pretty
            :highlightMouseoverNode="true"
            :showLength="true"
            :deep="3"
            :data="jsonText"
        ></vue-json-pretty>
    </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";

export default {
    name: "json-edit",
    components: {
        VueJsonPretty
    },
    props: ["jsonData", "stepActive"],
    data() {
        return {
            showText: {},
            showWarning: false
        };
    },
    computed: {
        jsonText() {
            try {
                this.showText = JSON.parse(this.jsonData);
                this.showWarning = false;
                return JSON.parse(this.jsonData);
            } catch {
                this.showWarning = true;
                return this.showText;
            }
        }
    },
    methods: {
        onCopy(e) {
            this.$message({
                message: "Copy Success!",
                type: "success"
            });
        },
        onError(e) {
            this.$message({
                message: "Copy Fail!",
                type: "error"
            });
        },
        goBack() {
            this.$emit("preStep");
        },
        goNext() {
            this.$emit("nextStep");
        }
    }
};
</script>

<style lang="less" scoped>
#json-edit {
    .btn-group {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }
}
</style>