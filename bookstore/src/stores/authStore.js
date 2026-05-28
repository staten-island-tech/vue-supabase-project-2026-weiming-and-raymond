import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useStore = defineStore('auth', {
 state: () => ({
   user: null
 }),

 actions: {

   async signUp(email, password) {
     const { data, error } = await supabase.auth.signUp({
       email,
       password
     })

     if (error) {
       alert(error.message)
     } else {
       this.user = data.user
     }
   },

   async login(email, password) {
     const { data, error } =
       await supabase.auth.signInWithPassword({
         email,
         password
       })

     if (error) {
       alert(error.message)
     } else {
       this.user = data.user
     }
   },

   async logout() {
     await supabase.auth.signOut()
     this.user = null
   },

   async fetchUser() {
     const { data } =
       await supabase.auth.getUser()

     this.user = data.user
   }
 }
})
