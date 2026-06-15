<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const orders = ref([])
const loading = ref(false)
const error = ref(null)

const getOrders = async () => {
  loading.value = true
  error.value = null

  const { data, error: err } = await supabase
    .from('orders')
    .select(`
      id,
      price,
      created_at,
      buyer_id,
      users!orders_buyer_id_fkey (
        user_id
      )
    `)
    .order('id', { ascending: false })

  if (err) {
    error.value = err.message
  } else {
    orders.value = data || []
  }

  loading.value = false
}

const totalOrders = computed(() => orders.value.length)

const totalRevenue = computed(() =>
  orders.value.reduce((sum, o) => sum + Number(o.price || 0), 0)
)

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0)

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))

onMounted(getOrders)
</script>

<template>
  <section class="orders">
    <header class="header">
      <h2>📦 Orders Dashboard</h2>
      <button class="refresh" @click="getOrders" :disabled="loading">
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </header>

    <div class="stats">
      <div class="card">
        <p class="label">Total Orders</p>
        <p class="value">{{ totalOrders }}</p>
      </div>

      <div class="card">
        <p class="label">Total Revenue</p>
        <p class="value">{{ formatCurrency(totalRevenue) }}</p>
      </div>
    </div>

    <div v-if="loading" class="state">Loading orders...</div>

    <div v-else-if="error" class="state error">
      ⚠️ {{ error }}
    </div>

    <div v-else-if="orders.length === 0" class="state">
      No orders yet.
    </div>

    <div v-else class="table">
      <div class="row header-row">
        <span>ID</span>
        <span>Buyer</span>
        <span>Price</span>
        <span>Date</span>
      </div>

      <div v-for="order in orders" :key="order.id" class="row">
        <span>#{{ order.id }}</span>
        <span>{{ order.buyer_id }}</span>
        <span class="price">{{ formatCurrency(order.price) }}</span>
        <span class="date">{{ formatDate(order.created_at) }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.orders {
  height: 84vh;
  padding: 24px;
  font-family: system-ui, -apple-system, sans-serif;
  color: #111827;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.refresh {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  transition: 0.2s;
}

.refresh:hover {
  background: #f3f4f6;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 14px;
  border-radius: 12px;
}

.label {
  font-size: 12px;
  color: #6b7280;
}

.value {
  font-size: 20px;
  font-weight: 600;
}

.state {
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px dashed #d1d5db;
  color: #6b7280;
}

.state.error {
  color: #b91c1c;
  border-color: #fecaca;
  background: #fef2f2;
}

.table {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.row {
  display: grid;
  grid-template-columns: 80px 1fr 120px 200px;
  padding: 12px 14px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.header-row {
  background: #f3f4f6;
  font-weight: 600;
}

.row:last-child {
  border-bottom: none;
}

.price {
  font-weight: 600;
}

.date {
  color: #6b7280;
}
</style>