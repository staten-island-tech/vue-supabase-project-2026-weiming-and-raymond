<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const username = ref('')
const email = ref('')
const password = ref('')

const register = async () => {
  try {
    await auth.register(username.value, email.value, password.value)

    alert('Registration successful')
  } catch (error) {
    alert(error.message)
  }
}
</script>

<template>
  <div>
    <h2>Register</h2>

    <input v-model="username" placeholder="Username" />

    <input v-model="email" placeholder="Email" />

    <input type="password" v-model="password" placeholder="Password" />

    <button @click="register">Register</button>
  </div>
</template>
