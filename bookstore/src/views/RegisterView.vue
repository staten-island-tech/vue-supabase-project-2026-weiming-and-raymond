<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useToast } from '@/components/composables/useToast'
const toast = useToast()
const auth = useAuthStore()
const username = ref('')
const email = ref('')
const password = ref('')

const register = async () => {
  try {
    await auth.register(username.value, email.value, password.value)
    toast.success('Registration successful')
  } catch (error) {
    toast.error(error.message)
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="card">
      <h2>Create account</h2>

      <label class="field">
        <input v-model="username" placeholder="Username" />
      </label>

      <label class="field">
        <input v-model="email" placeholder="Email" />
      </label>

      <label class="field">
        <input type="password" v-model="password" placeholder="Password" />
      </label>

      <div class="actions">
        <button class="btn primary" @click="register">Register</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-page {
  height: 84vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  padding: 28px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.16);
}

.card h2 {
  margin: 0 0 18px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  text-align: center;
}

.field {
  display: block;
  margin-bottom: 14px;
}

.field input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  outline: none;
}

.field input:focus {
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn.primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.25);
}

.btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
}

.btn.primary:active {
  transform: translateY(0);
  box-shadow: 0 6px 12px rgba(79, 70, 229, 0.2);
}
</style>
