<template>
  <div class="magical-container">
    <div class="form-header">
      <img src="/images/Hogwartscrest.webp" alt="Hogwarts Crest" class="hogwarts-crest" />
      <h1>Hogwarts School of Witchcraft and Wizardry</h1>
      <p class="magical-text">Welcome to the Official Magical Login Portal</p>
      <p>Access your account to enter the wizarding world. Each portal leads to your personalized magical dashboard within our enchanted walls.</p>

      <div class="navigation-section">
        <nav class="main-nav">
          <ul>
            <li><router-link to="/user-form">User Login</router-link></li>
            <li><router-link to="/student-form">Student Login</router-link></li>
            <li><router-link to="/admin-form">Admin Login</router-link></li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="form-content">
      <div class="info-section">
        <p><strong>The Four Houses:</strong></p>
        <div class="houses-container">
          <div class="house-item">
            <img src="/images/gryffindor-logo.webp" alt="Gryffindor" class="house-logo" />
            <span class="gryffindor">Gryffindor</span>
          </div>
          <div class="house-item">
            <img src="/images/hufflepuff-logo.webp" alt="Hufflepuff" class="house-logo" />
            <span class="hufflepuff">Hufflepuff</span>
          </div>
          <div class="house-item">
            <img src="/images/ravenclaw-logo.webp" alt="Ravenclaw" class="house-logo" />
            <span class="ravenclaw">Ravenclaw</span>
          </div>
          <div class="house-item">
            <img src="/images/slytherin-logo.webp" alt="Slytherin" class="house-logo" />
            <span class="slytherin">Slytherin</span>
          </div>
        </div>
        <h2>About Hogwarts Portal</h2>
        <p>Whether you're a student or admin, use your magical credentials to enter. Access your magical journey right in your hands.</p>
        <p class="spell-text">Enter your credentials to unlock your magical account and access all Hogwarts services!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>