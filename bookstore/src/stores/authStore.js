import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {

  actions: {

    async register(username, email, password) {

<<<<<<< HEAD
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
=======
      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) throw error

      // If email confirmation is enabled in Supabase, `data.user` may be null
      // until the user confirms their email. In that case, don't attempt to
      // insert a profile row yet — return the data so the UI can instruct the
      // user to check their email. If a user object is present, create the
      // profile immediately.
      if (!data?.user) {
        return data
      }

      const { error: insertError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          username
        }
      ])

      if (insertError) throw insertError
>>>>>>> parent of 6c3d1f8 (c)

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
