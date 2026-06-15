import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    initialized: false,
  }),

  actions: {
    async init() {
      if (!supabase) return
      if (this.initialized) return
      this.initialized = true

      try {
        const { data } = await supabase.auth.getUser()
        this.user = data?.user ?? null
      } catch (err) {
        console.warn('Failed to get supabase user during init', err)
      }

      try {
        supabase.auth.onAuthStateChange((event, session) => {
          this.user = session?.user ?? null
        })
      } catch (err) {
        console.warn('Failed to subscribe to auth state changes', err)
      }
    },

    async register(username, email, password) {
      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) throw error
      if (!data?.user) {
        return data
      }

      this.user = data.user

      const { error: insertError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          username,
        },
      ])

      if (insertError) throw insertError

      return data
    },

    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) throw error

      try {
        const { data: userData } = await supabase.auth.getUser()
        this.user = userData?.user ?? null
      } catch (err) {
        console.warn('Failed to refresh user after login', err)
      }

      return data
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
    },
  },
})
