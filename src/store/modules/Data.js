const state = {
    StructureText: "",
    JsonBFC: "",
    JsonAFC: "",
    TableLists: []
}

const getters = {
    getStructureText: state => state.StructureText,
    getJsonBFC: state => state.JsonBFC,
    getJsonAFC: state => state.JsonAFC,
    getTableLists: state => state.TableLists
}

const actions = {

}

const mutations = {
    updateStructureText(state, StructureText) {
        state.StructureText = StructureText;
    },
    updateJsonBFC(state, JsonBFC) {
        state.JsonBFC = JsonBFC;
    },
    updateJsonAFC(state, JsonAFC) {
        state.JsonAFC = JsonAFC;
    },
    updateTableLists(state, TableLists) {
        state.TableLists = TableLists;
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}