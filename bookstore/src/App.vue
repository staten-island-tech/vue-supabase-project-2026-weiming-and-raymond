<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header class="site-header">
      <div class="container">
        <div class="brand">
          <RouterLink to="/home" class="logo-link">They Call It The Store</RouterLink>
        </div>

        <nav class="main-nav" aria-label="Main navigation">
          <RouterLink to="/home">Home</RouterLink>
          <RouterLink to="/books">Books</RouterLink>
          <RouterLink to="/store">Store</RouterLink>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/register">Register</RouterLink>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
:root {
  --bg: #f6f8fa;
  --card: #ffffff;
  --muted: #6b7280;
  --accent: #2563eb;
}
.site-header {
  background: linear-gradient(90deg, #0f1720 0%, #0b1220 100%);
  color: #fff;
}
.site-header .container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}
.brand .logo-link {
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  font-size: 1.125rem;
}
.main-nav a {
  color: rgba(255, 255, 255, 0.9);
  margin-left: 14px;
  text-decoration: none;
  font-weight: 500;
}
.main-nav a:hover {
  color: var(--accent);
}
main {
  max-width: 1100px;
  margin: 24px auto;
  padding: 0 16px;
}
</style>
