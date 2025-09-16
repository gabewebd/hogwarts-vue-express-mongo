<template>
  <div class="magical-container single-column">
    <img src="/images/Hogwartscrest.webp" alt="Hogwarts Crest" class="hogwarts-crest" />
    <h1 class="error-404">404</h1>
    <h2>Page Not Found!</h2>
    <p class="magical-text">The magical page you seek does not exist</p>
    <p>The page you're looking for cannot be found in our magical database.</p>
    <p class="spell-text">Perhaps it was hidden by a Disillusionment Charm?</p>
    
    <div class="error-details">
      <h2>What happened?</h2>
      <p>The path you're trying to access doesn't exist in our magical portal.</p>
    </div>
    
    <nav>
      <router-link to="/" class="magical-button">Return to Hogwarts Portal</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
};
</script>

<style scoped>
.error-404 {
  font-size: 5rem;
  margin: 0;
  line-height: 1;
  color: #ff6b6b;
}
</style>