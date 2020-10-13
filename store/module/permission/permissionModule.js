const state = {
  permissions: [],
  usercenter_permission: null
};

const mutations = {
  setPermissions(state, permissions, usercenter_permission) {
    state.permissions = permissions;
    state.usercenter_permission = usercenter_permission;
  }
};

const actions = {
  setPermissions ({commit}, permissions, usercenter_permission) {
    commit("setPermissions", permissions, usercenter_permission);
  }
};

const getters = {
  getPermissions(state){
    let { permissions, usercenter_permission } = state;
    return { permissions, usercenter_permission };
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}