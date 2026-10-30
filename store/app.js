import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    auth: {
      authToken: '',
      hasLogin: false,
      userData: {}
    },
    permission: {
      permissions: [],
      usercenter_permission: null
    },
    filterColumn: {
      filter_columns: {}
    }
  }),
  getters: {
    getUser: (state) => state.auth.userData,
    getAuthToken: (state) => state.auth.authToken,
    getHasLogin: (state) => state.auth.hasLogin,
    getPermissions: (state) => ({
      permissions: state.permission.permissions,
      usercenter_permission: state.permission.usercenter_permission
    }),
    getFilterColumns: (state) => (name) => state.filterColumn.filter_columns[name]
  },
  actions: {
    login(user) {
      const { auth_token: authToken } = user
      this.auth.authToken = authToken
      this.auth.hasLogin = true
      this.auth.userData = user
    },
    logout() {
      this.auth.authToken = ''
      this.auth.hasLogin = false
      this.auth.userData = {}
    },
    setPermissions({ permissions, usercenter_permission }) {
      this.permission.permissions = permissions
      this.permission.usercenter_permission = usercenter_permission
    },
    setFilterColumns({ name, columns }) {
      this.filterColumn.filter_columns[name] = columns
    }
  },
  persist: {
    key: 'crm:pinia:storage',
    storage: {
      getItem: (key) => uni.getStorageSync(key),
      setItem: (key, value) => uni.setStorageSync(key, value),
      removeItem: (key) => uni.removeStorageSync(key)
    }
  }
})