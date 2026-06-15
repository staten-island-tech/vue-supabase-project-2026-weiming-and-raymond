import { defineStore } from 'pinia'
import { supabase, requireSupabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {
  actions: {
    async register(username, email, password) {
      const client = requireSupabase()

      try {
        const { data, error } = await client.auth.signUp({ email, password })
        console.log('auth.register response', { data, error })

        if (error) throw error

        // supabase-js may return the user on data.user or inside data.session.user
        const authUser = data?.user || data?.session?.user || null

        const { error: insertError } = await client.from('users').insert({
          id: authUser?.id || null,
          username,
          email,
          created: new Date().toISOString(),
        })

        if (insertError) throw insertError

        return authUser
      } catch (err) {
        console.error('register failed', err)
        throw new Error(err?.message || String(err))
      }
    },

    async login(email, password) {
      const client = requireSupabase()

      try {
        const { data, error } = await client.auth.signInWithPassword({ email, password })
        console.log('auth.login response', { data, error })
        if (error) throw error
        return data
      } catch (err) {
        console.error('login failed', err)
        throw new Error(err?.message || String(err))
      }
    },

    async logout() {
      const client = requireSupabase()
      await client.auth.signOut()
    },
  },
})
