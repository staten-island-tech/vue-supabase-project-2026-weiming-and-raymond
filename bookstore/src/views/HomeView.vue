<template>
  <main class="home">
    <section class="hero">
      <div class="hero-content">
        <span class="badge">📚 Discover Your Next Favorite Book</span>

        <h1>Welcome to the Bookstore</h1>

        <p class="subtitle">
          Explore timeless classics, bestselling novels, and hidden gems from
          every genre. Whether you're looking for your next adventure, a source
          of inspiration, or the perfect gift, there's a story waiting for you.
        </p>

        <div class="hero-actions">
          <button class="primary-btn" @click="router.push('/store')">Browse Collection</button>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="feature-card">
        <h3>📖 Thousands of Titles</h3>
        <p>
          Browse a diverse collection of books from fiction and fantasy to
          history, science, and more.
        </p>
      </div>

      <div class="feature-card">
        <h3>⭐ Reader Favorites</h3>
        <p>
          Discover highly rated books loved by readers around the world.
        </p>
      </div>

      <div class="feature-card">
        <h3>🚀 New Arrivals</h3>
        <p>
          Stay up to date with the latest releases and trending reads.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import router from '@/router';

</script>

<style scoped>
.home {
  height: 84vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc, #eef2ff);
  color: #1f2937;
}

.hero {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  padding: 4rem 1.5rem;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
  border-radius: 999px;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.hero h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1rem;
  font-weight: 800;
  line-height: 1.1;
}

.subtitle {
  max-width: 700px;
  margin: 0 auto;
  font-size: 1.15rem;
  line-height: 1.8;
  color: #4b5563;
}

.hero-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn {
  padding: 0.9rem 1.6rem;
  border-radius: 12px;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.primary-btn {
  background: #4f46e5;
  color: white;
}

.primary-btn:hover {
  background: #4338ca;
  transform: translateY(-2px);
}

.secondary-btn {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.secondary-btn:hover {
  background: #f9fafb;
  transform: translateY(-2px);
}

.features {
  max-width: 1100px;
  margin: 3rem auto 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: white;
  padding: 1.75rem;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
}
</style>
