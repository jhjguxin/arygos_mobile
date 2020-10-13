const state = {
  authToken: '',
  hasLogin: false,
  userData: {}
};

const mutations = {
  login(state, user) {
    let { auth_token: authToken } =  user;
    state.authToken = authToken;
    state.hasLogin = true;
    state.userData = user;
  },
  logout(state) {
    state.authToken = "";
    state.hasLogin = false;
    state.userData = {};
  }
} 

const actions = {
  login ({commit}, user) {
    commit("login", user);
  },
  logout ({commit}) {
    commit("login");
  },
}
const getters = {
  getUser(state){
    return state.userData;
  },
  getAuthToken(state) {
    return state.authToken;
  },
  getHasLogin(state) {
    return state.hasLogin;
  }
}

//暴露出去
export default {
    state,
    mutations,
    actions,
    getters
}