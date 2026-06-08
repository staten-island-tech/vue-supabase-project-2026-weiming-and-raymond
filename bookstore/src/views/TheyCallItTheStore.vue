<template>
  <section class="they-call-it-the-store">
    <header class="controls">
      <input v-model="query" @keyup.enter="search" placeholder="Search by title or author" />
      <button @click="search">Search</button>
    </header>

    <div v-if="loading" class="loading">Loading…</div>

    <div class="book-grid">
      <article v-for="b in books" :key="b.id" class="book-card">
        <img v-if="b.cover" :src="b.cover" :alt="b.title" class="cover" />
        <div class="meta">
          <h3 class="title">{{ b.title }}</h3>
          <p class="author">by {{ b.author }}</p>
        </div>
      </article>
    </div>

    <p v-if="!loading && books.length === 0" class="empty">No books found.</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const query = ref('')
const books = ref([])
const loading = ref(false)

function search() {
  loading.value = true
  const q = encodeURIComponent(query.value.trim() || 'fiction')
  fetch(`https://openlibrary.org/search.json?q=${q}&limit=20`)
    .then((r) => r.json())
    .then((data) => {
      const docs = data.docs || []
      const weiming = []
      for (let i = 0; i < docs.length; i++) {
        const d = docs[i]
        weiming.push({
          id: d.key || d.cover_edition_key || d.title,
          title: d.title || 'Untitled',
          author: (d.author_name && d.author_name[0]) || 'Unknown',
          cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : '',
        })
      }
      books.value = weiming
    })
    .catch(() => (books.value = []))
    .finally(() => (loading.value = false))
}

onMounted(() => search())
</script>
<style scoped>
.they-call-it-the-store {
  padding: 16px;
  font-family: system-ui, sans-serif;
}
.controls {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.controls input {
  flex: 1;
  padding: 6px 8px;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}
.book-card {
  border: 1px solid #e5e7eb;
  padding: 10px;
  border-radius: 6px;
  background: #fff;
}
.cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
  background: #f3f4f6;
}
.title {
  font-size: 1rem;
  margin: 0 0 4px;
}
.author,
.genre {
  font-size: 0.85rem;
  color: #555;
  margin: 0 0 4px;
}
.desc {
  font-size: 0.85rem;
  color: #333;
}
.empty {
  color: #888;
  margin-top: 12px;
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
  .storeheader {
    text-align: center;
  }
}
</style>
