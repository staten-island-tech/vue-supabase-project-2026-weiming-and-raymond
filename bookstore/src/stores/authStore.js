import { defineStore } from 'pinia'
import { supabase, requireSupabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {
  actions: {
    async register(username, email, password) {
      const client = requireSupabase()

      const { data, error } = await client.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      const authUser = data.user

      const { error: insertError } = await client.from('users').insert({
        id: authUser?.id,
        username,
        email,
        created: new Date().toISOString(),
      })

      if (insertError) throw insertError

      return authUser
    },

    async login(email, password) {
      const client = requireSupabase()

      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return data
    },

    async logout() {
      const client = requireSupabase()
      await client.auth.signOut()
    },
  },
})
