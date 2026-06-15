<template>
  <section class="they-call-it-the-store">
    <header class="controls">
      <input v-model="query" @keyup.enter="search" placeholder="Search by title or author" />
      <button @click="search" class="btn">Search</button>

      <div class="categories">
        <button
          v-for="c in categories"
          :key="c"
          @click="selectCategory(c)"
          :class="['chip', { active: category === c }]"
        >
          {{ c }}
        </button>
      </div>
    </header>

    <div v-if="loading" class="loading">Loading…</div>
    <div class="cart-summary" v-if="cart.length">
      <strong>Cart:</strong>

      <span v-for="item in cart" :key="item.id"> {{ item.title }} ({{ item.quantity }}) </span>

      <button class="checkout-btn" @click="checkout">Checkout</button>
    </div>
    <div class="book-grid">
      <article v-for="b in filteredBooks" :key="b.id" class="book-card">
        <img v-if="b.cover" :src="b.cover" :alt="b.title" class="cover" />
        <div class="meta">
          <h3 class="title">{{ b.title }}</h3>
          <p class="author">by {{ b.author }}</p>

          <div class="actions">
            <span class="price">${{ (b.price || 19.99).toFixed(2) }}</span>

            <button class="buy-btn" @click="buyBook(b)">Buy Now</button>
          </div>
        </div>
      </article>
    </div>

    <p v-if="!loading && filteredBooks.length === 0" class="empty">No books found.</p>
  </section>
</template>

<script setup>
import { useToast } from '@/components/composables/useToast.js'
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'

const query = ref('')
const books = ref([])
const loading = ref(false)
const cart = ref([])
const toast = useToast()
const categories = ref(['All', 'Fiction', 'Nonfiction', 'Science', 'History', 'Mystery'])
const category = ref('All')

function selectCategory(c) {
  category.value = c
  if (c === 'All') search()
}

function buyBook(book) {
  const existing = cart.value.find((b) => b.id === book.id)

  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({
      ...book,
      quantity: 1,
      price: book.price || 19.99,
    })
  }

  toast.success(`Added "${book.title}" to cart`)
}
async function checkout() {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      toast.error('You must be logged in')
      return
    }

    const { data: dbUser, error: userError } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', user.email)
      .single()

    if (userError || !dbUser) {
      toast.error('User record not found')
      return
    }

    const total = cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const { error: orderError } = await supabase.from('orders').insert({
      buyer_id: dbUser.user_id,
      price: total,
      created_at: new Date().toISOString(),
    })

    if (orderError) throw orderError

    toast.success(`Order placed!\nItems: ${cart.value.length}\nTotal: $${total.toFixed(2)}`)

    cart.value = []
  } catch (err) {
    toast.error('Failed to place order')
  }
}

const CACHE_DURATION = 1000 * 60 * 60

async function search() {
  const rawQuery = query.value.trim() || (category.value === 'All' ? 'fiction' : category.value)

  const cacheKey = `books:${rawQuery}`

  const cached = localStorage.getItem(cacheKey)

  if (cached) {
    const parsed = JSON.parse(cached)

    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      books.value = parsed.data
      return
    }
  }

  loading.value = true

  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(rawQuery)}&limit=20`,
    )

    const data = await res.json()

    const booksData = (data.docs || []).map((d) => ({
      id: d.key || d.cover_edition_key || d.title,
      title: d.title || 'Untitled',
      author: d.author_name?.[0] || 'Unknown',
      cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : '',
      price: Number((Math.random() * 25 + 5).toFixed(2)),
    }))

    books.value = booksData

    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        timestamp: Date.now(),
        data: booksData,
      }),
    )
  } finally {
    loading.value = false
  }
}
const filteredBooks = computed(() => {
  if (!query.value && category.value === 'All') return books.value
  const q = query.value.trim().toLowerCase()
  return books.value.filter((b) => {
    const matchesQuery =
      !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    const matchesCategory =
      category.value === 'All' || b.title.toLowerCase().includes(category.value.toLowerCase())
    return matchesQuery && matchesCategory
  })
})

onMounted(() => search())
</script>

<style scoped>
.they-call-it-the-store {
  padding: 16px;
  font-family: system-ui, sans-serif;
}
.controls {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}
.controls input {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #e6e9ee;
}
.controls .btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: 0;
  background: #2563eb;
  color: #fff;
}
.categories {
  margin-left: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  background: #f1f5f9;
  border-radius: 999px;
  padding: 6px 10px;
  border: 0;
  cursor: pointer;
}
.chip.active {
  background: #2563eb;
  color: #fff;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.book-card {
  background: var(--card, #fff);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(11, 20, 30, 0.06);
}
.book-card .cover {
  width: 100%;
  height: 240px;
  object-fit: cover;
  background: #f3f4f6;
}
.book-card .meta {
  padding: 12px;
}
.title {
  font-size: 1rem;
  margin: 0 0 6px;
}
.author {
  color: var(--muted, #6b7280);
  margin: 0;
}
.empty {
  color: #888;
  margin-top: 12px;
  text-align: center;
}
.loading {
  text-align: center;
  color: #666;
  margin: 12px 0;
}

@media (min-width: 1024px) {
  .controls {
    max-width: 1000px;
    margin: 0 auto 12px;
  }
}
.actions {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: 600;
}

.buy-btn {
  background: #16a34a;
  color: white;
  border: 0;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.buy-btn:hover {
  opacity: 0.9;
}

.cart-summary {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  padding: 12px;
  margin-bottom: 16px;
  background: #f8fafc;
  border-radius: 10px;
}

.checkout-btn {
  background: #2563eb;
  color: white;
  border: 0;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
