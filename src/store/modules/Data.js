import config from "@/config";

const state = {
    StructureText: "",
    JsonBFC: "",
    JsonAFC: "",
    BackLists: [],
    TableLists: []
}

const getters = {
    getStructureText: state => state.StructureText,
    getJsonBFC: state => state.JsonBFC,
    getJsonAFC: state => state.JsonAFC,
    getBackLists: state => state.BackLists,
    getTableLists: state => state.TableLists
}

const actions = {
    setTable({ getters, commit }) {
        let arr = [];
        getters.getBackLists.forEach(list => {
            arr.push({
                name: list.name,
                type: list.type,
                need: "",
                remark: "",
                isHead: true
            });
            list.data.forEach(item => {
                arr.push({
                    name: item.input,
                    type: item.type,
                    need: item.need,
                    remark: item.remark,
                    isHead: false
                });
            });
        });
        arr.filter(e => !e.isHead).forEach(item => {
            if (!Object.keys(config.basisTypes).includes(item.type)) {
                let foundItem = arr
                    .filter(e => e.isHead)
                    .find(e => e.name === item.type);
                if (foundItem && foundItem.type) {
                    switch (foundItem.type) {
                        // case "obj":
                        //     item.type = `{}${item.type}`;
                        //     break;
                        case "list":
                            item.type = `[]${item.type}`;
                            break;
                    }
                }
            }
        });
        // 隐藏结构名的类型
        arr.filter(e => e.isHead).forEach(item => {
            item.type = "";
        });
        // 必填项用Y/N表示
        arr.forEach(item => {
            switch (item.need) {
                case "true":
                    item.need = "Y";
                    break;
                case "false":
                    item.need = "N";
                    break;
            }
        });
        commit('updateTableLists', arr);
    },
    setJsonBFC({ getters, commit }) {
        let JsonBFC = JSON.parse(transform(getters.getBackLists[0]));
        commit("updateJsonBFC", JsonBFC);
    }
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
    },
    updateBackLists(state, BackLists) {
        state.BackLists = BackLists;
        this.dispatch("setJsonBFC");
        this.dispatch("setTable");
    }
}

function transform(list, index = 0) {
    if (index > config.NestNum) {
        console.warn(
            `嵌套最多${config.NestNum}层, 请勿循环嵌套`
        );
        return;
    }
    if (!list) {
        return;
    }
    let data = list.data;
    let str = "";
    index++;
    data.forEach(item => {
        if (item.input) {
            str += `"${item.input}":`;
            if (Object.keys(config.basisTypes).includes(item.type)) {
                str += `${config.basisTypes[item.type]},`;
            } else if (item.type === "interface{}") {
                str += `null,`;
            } else {
                let res = findInList(item.type, list.name);
                let childStr = transform(res, index) || "null";
                str += `${childStr},`;
            }
        }
    });
    switch (list.type) {
        case "obj":
            str = str ? `{${str}}` : "";
            break;
        case "list":
            str = str ? `[{${str}}]` : "";
            break;
    }
    return str.replace(/,}/g, "}");
}

function findInList(name, faName) {
    let arr = [...state.BackLists];
    let res = arr
        .filter(item => {
            return item.name !== faName;
        }) //排除自循环
        .find(item => {
            return item.name === name;
        });
    return res;
}

export default {
    state,
    getters,
    actions,
    mutations
}