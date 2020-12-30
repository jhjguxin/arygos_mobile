const state = {
  filter_columns: {},
};

const mutations = {
  setFilterColumns(state, {name, columns}) {
    state.filter_columns[name] = columns;
  }
};

const actions = {
  setFilterColumns ({commit}, {name, columns}) {
    commit("setFilterColumns", {name, columns});
  }
};

const getters = {
  getFilterColumns(state){
    return (name) => {
      let { filter_columns: { [`${name}`]: columns } } = state;
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