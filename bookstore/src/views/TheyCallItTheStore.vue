<template>
  <section class="they-call-it-the-store">
    <header class="controls">
      <input v-model="query" placeholder="Search by title or author" />
      <select v-model="selectedGenre">
        <option value="">All genres</option>
        <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
      </select>
    </header>

    <div class="book-grid">
      <article v-for="book in filteredBooks" :key="book.id" class="book-card">
        <img v-if="book.cover" :src="book.cover" :alt="book.title" class="cover" />
        <div class="meta">
          <h3 class="title">{{ book.title }}</h3>
          <p class="author">by {{ book.author }}</p>
          <p class="genre" v-if="book.genre">{{ book.genre }}</p>
          <p class="desc" v-if="book.description">{{ book.description }}</p>
        </div>
      </article>
    </div>

    <p v-if="filteredBooks.length === 0" class="empty">No books found.</p>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const query = ref('')
const selectedGenre = ref('')

const books = ref([
  {
    id: 1,
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopia',
    cover: '',
    description: 'A classic dystopian novel.',
  },
  {
    id: 2,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    cover: '',
    description: 'A fantasy adventure.',
  },
  {
    id: 3,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Programming',
    cover: '',
    description: 'Practical advice for writing clean code.',
  },
  // add more book objects here (cover can be a relative path like /src/assets/cover.jpg or an external URL)
])

const genres = computed(() => {
  const set = new Set(books.value.map((b) => b.genre).filter(Boolean))
  return Array.from(set)
})

const filteredBooks = computed(() => {
  const q = query.value.trim().toLowerCase()
  return books.value.filter((b) => {
    const matchesQuery =
      !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    const matchesGenre = !selectedGenre.value || b.genre === selectedGenre.value
    return matchesQuery && matchesGenre
  })
})
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
</style>
