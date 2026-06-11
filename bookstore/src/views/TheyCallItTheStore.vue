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

    <div class="book-grid">
      <article v-for="b in filteredBooks" :key="b.id" class="book-card">
        <img v-if="b.cover" :src="b.cover" :alt="b.title" class="cover" />
        <div class="meta">
          <h3 class="title">{{ b.title }}</h3>
          <p class="author">by {{ b.author }}</p>
        </div>
      </article>
    </div>

    <p v-if="!loading && filteredBooks.length === 0" class="empty">No books found.</p>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const query = ref('')
const books = ref([])
const loading = ref(false)

const categories = ref(['All', 'Fiction', 'Nonfiction', 'Science', 'History', 'Mystery'])
const category = ref('All')

function selectCategory(c) {
  category.value = c
  if (c === 'All') search()
}

async function search() {
  loading.value = true
  books.value = []
  const rawQuery = query.value.trim() || (category.value === 'All' ? 'fiction' : category.value)
  const q = encodeURIComponent(rawQuery)

  try {
    const res = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=20`)
    if (!res.ok) {
      const text = await res.text()
      console.error('OpenLibrary responded with', res.status, text)
      books.value = []
      return
    }
    const data = await res.json()
    console.log('OpenLibrary search result for', rawQuery, data)
    const docs = data.docs || []
    const parsed = docs.map((d) => ({
      id: d.key || d.cover_edition_key || d.title,
      title: d.title || 'Untitled',
      author: (d.author_name && d.author_name[0]) || 'Unknown',
      cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : '',
    }))
    books.value = parsed
  } catch (err) {
    console.error('Failed to fetch books', err)
    books.value = []
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
</style>
