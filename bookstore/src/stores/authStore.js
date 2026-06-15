import { defineStore } from 'pinia'
import { login as identityLogin, signup, logout as identityLogout } from '@netlify/identity'

export const useAuthStore = defineStore('auth', {
  actions: {
    async register(username, email, password) {
      const user = await signup(email, password, { full_name: username })
      return user
    },

    async login(email, password) {
      const user = await identityLogin(email, password)
      return user
    },

    async logout() {
      await identityLogout()
    },
  },
})
