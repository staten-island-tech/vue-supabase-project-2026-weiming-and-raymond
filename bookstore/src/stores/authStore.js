import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {

  actions: {

    async register(username, email, password) {

      const { data, error } =
        await supabase.auth.signUp({
          email,
          password
        })

      if (error) throw error

      await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username
          }
        ])

      return data
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
