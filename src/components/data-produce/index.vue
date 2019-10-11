<template>
    <div id="data-produce">
        <el-tabs>
            <el-tab-pane label="Table For EXCEL">
                <el-button
                    class="export-btn"
                    type="info"
                    :loading="exportLoading"
                    @click="exportExcel"
                >以Excel导出下表</el-button>
                <el-table :data="tableLists" border>
                    <el-table-column prop="name" label="字段名称"></el-table-column>
                    <el-table-column prop="type" label="类型"></el-table-column>
                    <el-table-column prop="need" label="必填"></el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="JSON">
                <el-button
                    class="export-btn"
                    type="info"
                    v-clipboard:error="onError"
                    v-clipboard:copy="copyText"
                    v-clipboard:success="onCopy"
                >复制JSON</el-button>
                <vue-json-pretty
                    :highlightMouseoverNode="true"
                    :showLength="true"
                    :deep="3"
                    :data="jsonAFC"
                ></vue-json-pretty>
            </el-tab-pane>
            <el-tab-pane label="GO">
                <el-button
                    class="export-btn"
                    type="info"
                    v-clipboard:error="onError"
                    v-clipboard:copy="GoText"
                    v-clipboard:success="onCopy"
                >复制GO</el-button>
                <el-card shadow="hover">
                     <el-checkbox v-model="InlineType">Inline type definitions</el-checkbox>
                    <pre>{{GoText}}</pre>
                </el-card>
            </el-tab-pane>
            <el-tab-pane label="TODO">TODO</el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import VueJsonPretty from "vue-json-pretty";
import { jsonToGo } from "@/utils/format.js";
export default {
    name: "data-produce",
    components: {
        VueJsonPretty
    },
    data() {
        return {
            exportLoading: false,
            InlineType: false
        };
    },
    computed: {
        copyText: function() {
            return JSON.stringify(this.jsonAFC, null, 4);
        },
        GoText: function() {
            let data = JSON.stringify(this.jsonAFC);
            let type = !this.InlineType;
            return jsonToGo(data, "", type).go;
        },
        tableLists: function() {
            return this.$store.getters.getTableLists;
        },
        jsonAFC: function() {
            return this.$store.getters.getJsonAFC;
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
        getArr() {
            let arr = [];
            this.tableLists.forEach(item => {
                arr.push([item.name, item.type]);
            });
            return arr;
        },
        exportExcel() {
            this.exportLoading = true;
            let data = this.getArr();
            import("@/utils/Export2Excel").then(excel => {
                this.exportLoading = false;
                excel.export_json_to_excel({
                    header: ["字段名称", "类型", "必填", "备注"],
                    data,
                    filename: "excel-list",
                    autoWidth: true,
                    bookType: "xlsx"
                });
            });
        }
    }
};
</script>

<style lang="less" scoped>
#data-produce {
    .export-btn {
        width: 100%;
        margin-bottom: 5px;
    }
}
</style>