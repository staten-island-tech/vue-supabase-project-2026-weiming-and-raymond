<script setup>
import { useToast } from '../composables/useToast'

const toast = useToast()
</script>

<template>
  <div class="toast-container">
    <div
      v-for="t in toast.state.toasts"
      :key="t.id"
      class="toast"
      :class="t.type"
    >
      <span class="message">{{ t.message }}</span>

      <button class="close" @click="toast.remove(t.id)">
        ✕
      </button>
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
}

/* TOAST BASE */
.toast {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  padding: 12px 14px;
  border-radius: 12px;
  min-width: 240px;

  color: white;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);

  animation: slideIn 0.2s ease;
}

/* TYPES */
.toast.success {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
}

.toast.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

/* TEXT */
.message {
  flex: 1;
  font-size: 0.95rem;
}

/* CLOSE BUTTON */
.close {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.8;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.close:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* ANIMATION */
@keyframes slideIn {
  from {
    transform: translateY(-8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>