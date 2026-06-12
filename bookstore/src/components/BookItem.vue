<template>
  <article class="book-card" role="article" :aria-label="book.title">
    <img v-if="book.cover" :src="book.cover" :alt="book.title + ' cover'" class="cover" />
    <div class="meta">
      <h3 class="title">{{ titleDisplay }}</h3>
      <p class="author">by {{ book.author || 'Unknown' }}</p>
      <slot name="actions" />
    </div>
  </article>
</template>

<script setup>
import { computed, toRefs } from 'vue'
const props = defineProps({ book: { type: Object, required: true } })
const { book } = toRefs(props)

const titleDisplay = computed(() => (book.value.title ? book.value.title : 'Untitled'))
</script>

<style scoped>
.book-card {
  background: var(--card, #fff);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(11, 20, 30, 0.06);
}
.cover {
  width: 100%;
  height: 240px;
  object-fit: cover;
  background: #f3f4f6;
}
.meta {
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
</style>
