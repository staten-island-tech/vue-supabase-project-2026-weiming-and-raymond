<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const books = ref([])

const getBooks = async () => {
  const { data } = await supabase.from('books').select('*').order('id', { ascending: false })

  books.value = data
}

onMounted(() => {
  getBooks()
})
</script>

<template>
  <h2>Books</h2>
  <h3 v-for="book in books" :key="book.id">{{ book.title }} - {{ book.author }}</h3>
</template>
