<template>
    <div id="home">
        <el-card class="pane">
            <structure-input @setJson="setJson"/>
        </el-card>
        <el-card class="pane">
            <json-show :jsonText="jsonText" />
        </el-card>
    </div>
</template>

<script>
import JsonShow from "@/components/json-show";
import StructureInput from "@/components/structure-input";

export default {
    name: "home",
    components: {
        JsonShow,
        StructureInput
    },
    data() {
        return {
            jsonText: "",
        };
    },
    methods: {
        setJson(jsonText) {
            this.jsonText = jsonText;
        }
    }
};
</script>

<style lang="less" scoped>
#home {
    display: flex;
    flex-wrap: wrap;
    .pane {
        flex: 1;
        margin: 0 10px;
        min-width: 300px;
    }
}
</style>