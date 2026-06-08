<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()

const email = ref('')
const password = ref('')

const login = async () => {
  try {
    await auth.login(email.value, password.value)

    alert('Login successful')
  } catch (error) {
    alert(error.message)
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="card">
      <h2>Login</h2>

      <label class="field">
        <input v-model="email" placeholder="Email" />
      </label>

      <label class="field">
        <input type="password" v-model="password" placeholder="Password" />
      </label>

      <div class="actions">
        <button class="btn primary" @click="login">Login</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}
.card {
  width: 100%;
  max-width: 420px;
  background: var(--card, #fff);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(11, 20, 30, 0.08);
}
.card h2 {
  margin: 0 0 12px;
}
.field {
  display: block;
  margin-bottom: 12px;
}
.field input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
.btn {
  padding: 8px 12px;
  border-radius: 6px;
  border: 0;
  cursor: pointer;
}
.btn.primary {
  background: var(--accent);
  color: #fff;
}
</style>
