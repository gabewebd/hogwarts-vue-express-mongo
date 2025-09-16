<template>
  <div class="magical-container single-column">
    <div class="form-header">
      <h1>User Login</h1>
    </div>

    <div class="form-content">
      <form @submit.prevent="handleLogin">
        <label for="userID">User ID:</label>
        <input type="text" id="userID" v-model="form.userID" placeholder="Enter your user ID" required />

        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" v-model="form.firstName" placeholder="Enter your first name" required />

        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" v-model="form.lastName" placeholder="Enter your last name" required />

        <input type="submit" value="Access User Dashboard" />
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
    
    <nav style="margin-top: 30px;">
      <router-link to="/" class="magical-button">Return to Hogwarts Portal</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'UserFormView',
  data() {
    return {
      form: {
        userID: '',
        firstName: '',
        lastName: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = '';
      try {
        const response = await fetch('/api/user-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.form)
        });

        const data = await response.json();

        if (response.ok) { // Check if the HTTP status code is in the 200-299 range
          this.$router.push({
            name: 'userResult',
            query: { ...data.data, status: 'success', type: 'user' }
          });
        } else {
          this.errorMessage = data.message || 'An unknown error occurred.';
          this.$router.push({
            name: 'userResult',
            query: { status: 'error', type: 'user', message: data.message || 'An unknown error occurred.' }
          });
        }
      } catch (error) {
        this.errorMessage = 'Failed to connect to the Hogwarts server.';
        this.$router.push({
          name: 'userResult',
          query: { status: 'error', type: 'user', message: this.errorMessage }
        });
      }
    }
  }
}
</script>

<style scoped>
.error-message {
  color: #ff6b6b;
  margin-top: 15px;
  text-align: center;
}
</style>