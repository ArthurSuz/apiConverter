<template>
    <div id="data-produce">
        <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="Table(from Basic) For EXCEL" name="1">
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
            </el-collapse-item>
            <el-collapse-item title="YAPI" name="2">
                <div>TODO</div>
            </el-collapse-item>
            <el-collapse-item title="TODO" name="3">
                <div>TODO</div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
export default {
    name: "data-produce",
    props: ["tableLists"],
    data() {
        return {
            activeName: "1",
            exportLoading: false
        };
    },
    methods: {
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
            import("@/excel/Export2Excel").then(excel => {
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