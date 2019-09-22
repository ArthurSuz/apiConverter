<template>
    <div id="json-show">
        <el-switch
            class="config"
            v-model="showDoubleQuotes"
            active-text="标准JOSN"
            inactive-text="去双引号"
        ></el-switch>
        <vue-json-pretty
            :showDoubleQuotes="showDoubleQuotes"
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
    name: "json-show",
    components: {
        VueJsonPretty
    },
    props: ["jsonText"],
    data() {
        return {
            showDoubleQuotes: true
        };
    }
};
</script>

<style lang="less" scoped>
#json-show {
    .config {
        float: right;
        z-index: 1;
    }
}
</style>