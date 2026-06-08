<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

const title = ref('')
const author = ref('')

const addBook = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  await supabase.from('books').insert({
    title: title.value,
    author: author.value,
    user_id: user.id,
  })

  title.value = ''
  author.value = ''

  alert('Book Added')
}
</script>

<template>
  <h2>Add Book</h2>

  <input v-model="title" placeholder="Title" />
  <input v-model="author" placeholder="Author" />

  <button @click="addBook">Save</button>
</template>
