<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const books = ref([])

const getBooks = async () => {
  const { data } = await supabase.from('books').select('*').order('id', { ascending: false })

  books.value = data || []
}

onMounted(() => {
  getBooks()
})
</script>

<template>
  <section class="books-view">
    <h2>Books</h2>
    <div v-if="books.length === 0">No books yet.</div>
    <ul>
      <li v-for="book in books" :key="book.id">{{ book.title }} - {{ book.author }}</li>
    </ul>
  </section>
</template>

<style scoped>
.books-view {
  padding: 1rem;
}
</style>
