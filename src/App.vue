<template>
    <div id="app">
        <el-container>
            <el-header class="header">API-Converter</el-header>
            <el-main>
                <Home class="home" />
            </el-main>
        </el-container>
    </div>
</template>

<script>
import Home from "./views/Home.vue";

export default {
    name: "app",
    components: {
        Home
    }
};
</script>

<style lang="less" scoped>
#app {
    min-width: 300px;
    .header {
        display: flex;
        align-items: center;
        background-color: #fff;
        width: 100%;
        border-bottom: 1px solid #dcdfe6;
        font-size: 32px;
    }
}
</style>
