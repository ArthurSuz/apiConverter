<template>
    <div id="json-show">
        <div class="btn-group">
            <div>
                <el-button-group v-if="stepActive===1">
                    <el-button size="mini" icon="el-icon-arrow-left" @click="goBack">Previous</el-button>
                </el-button-group>
            </div>
            <div>
                <el-button-group v-if="stepActive===0">
                    <el-button
                        size="mini"
                        v-clipboard:error="onError"
                        v-clipboard:copy="copyText"
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
        <vue-json-pretty
            :highlightMouseoverNode="true"
            :showLength="true"
            :deep="3"
            :data="jsonText"
            v-if="!showEditPane"
        ></vue-json-pretty>
        <el-input type="textarea" autosize v-model="editText" v-else></el-input>
    </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
export default {
    name: "json-show",
    components: {
        VueJsonPretty
    },
    props: ["jsonText", "stepActive"],
    computed: {
        copyText: function() {
            return this.showEditPane
                ? this.editText
                : JSON.stringify(this.jsonText, null, 2);
        }
    },
    watch: {
        copyText: function(newValue, oldValue) {
            this.$emit("setText", newValue);
        }
    },
    data() {
        return {
            showEditPane: false,
            editText: ""
        };
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
        edit() {
            this.showEditPane = true;
            this.editText = JSON.stringify(this.jsonText, null, 2);
        },
        goBack() {
            this.showEditPane = false;
            this.$emit("preStep");
        },
        goNext() {
            this.edit();
            this.$emit("nextStep");
        }
    }
};
</script>

<style lang="less" scoped>
#json-show {
    .btn-group {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }
}
</style>