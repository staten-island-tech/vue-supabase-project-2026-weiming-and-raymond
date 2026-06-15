import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useBookStore = defineStore('book', () => {
  const books = ref([])
  const loading = ref(false)

  const fetchBooks = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('id', { ascending: false })
      if (error) throw error
      books.value = data || []
      return books.value
    } catch (err) {
      console.error('fetchBooks error', err)
      books.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const addBook = async (payload) => {
    try {
      const { data, error } = await supabase.from('books').insert(payload).select()
      if (error) throw error
      if (data && data[0]) books.value.unshift(data[0])
      return data
    } catch (err) {
      console.error('addBook error', err)
      throw err
    }
  }

  const updateBook = async (id, changes) => {
    try {
      const { data, error } = await supabase.from('books').update(changes).eq('id', id).select()
      if (error) throw error
      const idx = books.value.findIndex((b) => b.id === id)
      if (idx >= 0 && data && data[0]) books.value[idx] = data[0]
      return data
    } catch (err) {
      console.error('updateBook error', err)
      throw err
    }
  }

  const deleteBook = async (id) => {
    try {
      const { data, error } = await supabase.from('books').delete().eq('id', id).select()
      if (error) throw error
      books.value = books.value.filter((b) => b.id !== id)
      return data
    } catch (err) {
      console.error('deleteBook error', err)
      throw err
    }
  }

  return { books, loading, fetchBooks, addBook, updateBook, deleteBook }
})

export default useBookStore
