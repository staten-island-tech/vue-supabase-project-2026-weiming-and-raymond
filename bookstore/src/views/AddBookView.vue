<script setup>
import { ref } from 'vue'
import { getUser } from '@netlify/identity'
import { supabase } from '../lib/supabase'

const title = ref('')
const author = ref('')

const addBook = async () => {
  if (!title.value.trim()) {
    alert('Please provide a book title')
    return
  }

  try {
    const user = await getUser()

    const payload = {
      title: title.value.trim(),
      author: author.value.trim() || null,
      user_id: user?.id || null,
    }

    const { error: insertErr } = await supabase.from('books').insert(payload)
    if (insertErr) throw insertErr

    title.value = ''
    author.value = ''
    alert('Book added')
  } catch (err) {
    console.error('addBook failed', err)
    alert('Failed to add book: ' + (err.message || err))
  }
}
</script>

<template>
  <h2>Add Book</h2>

  <input v-model="title" placeholder="Title" />
  <input v-model="author" placeholder="Author" />

  <button @click="addBook">Save</button>
</template>
