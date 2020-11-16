const state = {
  filter_columns: {},
};

const mutations = {
  setFilterColumns(state, {klassName, columns}) {
    state.filter_columns[klassName] = columns;
  }
};

const actions = {
  setFilterColumns ({commit}, {klassName, columns}) {
    commit("setFilterColumns", {klassName, columns});
  }
};

const getters = {
  getFilterColumns(state){
    return (klassName) => {
      let { filter_columns: { [`${klassName}`]: columns } } = state;
      return columns;
    };
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}