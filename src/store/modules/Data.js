import config from "@/config";
import { jsonToGo } from "@/utils/format.js";

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
        // console.log(transform(getters.getBackLists[0]));
        let JsonBFC = JSON.parse(transform(getters.getBackLists[0]));
        commit("updateJsonBFC", JsonBFC);
    },
    setStructureText({ commit }, { data, dataType }) {
        return new Promise(function (resolve, reject) {
            try {
                let obj;
                switch (dataType) {
                    case "JSON":
                        if (
                            JSON.stringify(data).replace(/\\n|\s/g, "") ===
                            `"{}"`
                        ) {
                            throw "";
                        }
                        obj = jsonToGo(data, "", true, true).go;
                        break;
                    case "GO":
                        obj = data;
                        break;
                }
                let goDataArr = [];
                let goDataSp = {};
                let lastindex = 0;
                obj.trim().split("\n")
                    .forEach(e => {
                        if (!e) {
                            return;
                        }
                        let arrInt = e.trim().split("`").filter(e => e);
                        let arrInt_1 = arrInt[0].trim().split(" ").filter(e => e);
                        let arrInt_2 = arrInt[1] && arrInt[1].trim().split(" ").filter(e => e.includes("json")) || null;
                        let arrRes = arrInt[1] ? [...arrInt_1, ...arrInt_2] : [...arrInt_1];
                        let curArr = arrInt[2] ? [...arrRes, arrInt[2].trim()] : arrRes;
                        if (curArr[0] === "type") {
                            goDataArr.push({
                                name: curArr[1],
                                type:
                                    /(\S*)struct/.exec(curArr[2])[1] ===
                                        "[]"
                                        ? "list"
                                        : "obj",
                                data: []
                            });
                        } else if (curArr[0] === "}") {
                            lastindex++;
                        } else if (curArr[0].includes("//")) {
                            //跳过注释
                        } else if (curArr.length >= 2) {
                            if (!Object.keys(config.basisTypes).includes(curArr[1])) {
                                if (curArr[1].includes("[]")) {
                                    goDataSp[curArr[1].replace("[]", "")] = "list";
                                } else if (!curArr[1].includes("interface{}")) {
                                    goDataSp[curArr[1]] = "obj";
                                }
                            }
                            if (!(/^[A-Z]/).test(curArr[0])) { return; }//首位非大写字母时跳过
                            let input = curArr[2] ? /json:"(\S*)"/.exec(curArr[2])[1] : curArr[0].replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
                            goDataArr[lastindex].data.push({
                                input, need: "true", remark: "",
                                type: replaceTheBrackets(curArr[1]),
                                originalData: { type: replaceTheBrackets(curArr[1]), value: curArr.slice(3).join(" ") }
                            });
                        }
                    });

                goDataArr.forEach(item => {
                    let key = Object.keys(goDataSp).find(e => e === item.name);
                    if (key) {
                        item.type = goDataSp[key];
                    }
                });
                if (JSON.stringify(goDataArr) === "[]" || !goDataArr) {
                    throw "";
                }
                commit("updateStructureText", goDataArr);
                resolve();
            } catch {
                reject();
            }
        });
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
        // eslint-disable-next-line no-console
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
                // console.log(item.input,item.originalData.type,item.originalData.value)
                str += item.originalData && item.originalData.value && item.type === item.originalData.type ? `${item.originalData.value},` : `${config.basisTypes[item.type]},`;
            } else if (item.type.includes("interface{}")) {
                if (item.type === "interface{}") {
                    str += `null,`;
                } else {
                    str += `{},`;
                }
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

function replaceTheBrackets(val) {
    val = val.replace(/\*/g, "");
    return Object.keys(config.basisTypes).includes(val) ? val : val.replace("[]", "");
}

export default {
    state,
    getters,
    actions,
    mutations
}