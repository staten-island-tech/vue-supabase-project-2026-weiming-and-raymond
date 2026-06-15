import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {

  actions: {
    async register(username, email, password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      const authUser = data.user

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          username,
          email,
          password,
          created: new Date().toISOString(),
        })

      if (insertError) throw insertError

      return authUser
    },

    async login(email, password) {

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password
        })

      if (error) throw error

      return data
    },

    async logout() {
      await supabase.auth.signOut()
    }
  }
})

