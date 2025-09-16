<template>
  <div class="magical-container single-column">
    <div class="form-header">
      <h1>Student Login</h1>
    </div>

    <div class="form-content">
      <form @submit.prevent="handleLogin">
        <label for="studentID">Student ID:</label>
        <input type="text" id="studentID" v-model="form.studentID" placeholder="Enter your student ID" required />

        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" v-model="form.firstName" placeholder="Enter your first name" required />

        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" v-model="form.lastName" placeholder="Enter your last name" required />

        <label for="house">House:</label>
        <select id="house" v-model="form.house" required>
          <option value="">Select your house</option>
          <option value="Gryffindor">Gryffindor</option>
          <option value="Hufflepuff">Hufflepuff</option>
          <option value="Ravenclaw">Ravenclaw</option>
          <option value="Slytherin">Slytherin</option>
        </select>

        <input type="submit" value="Access Student Dashboard" />
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
  name: 'StudentFormView',
  data() {
    return {
      form: {
        studentID: '',
        firstName: '',
        lastName: '',
        house: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = '';
      try {
        const response = await fetch('/api/student-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.form),
        });

        const data = await response.json();

        if (response.ok) {
          this.$router.push({
            name: 'userResult',
            query: { 
              status: 'success', 
              type: 'student'
            },
            state: { userData: data.data }
          });
        } else {
          this.errorMessage = data.message || 'An unknown error occurred.';
          this.$router.push({
            name: 'userResult',
            query: { 
              status: 'error', 
              type: 'student', 
              message: data.message || 'An unknown error occurred.' 
            }
          });
        }
      } catch (error) {
        this.errorMessage = 'Failed to connect to the Hogwarts server.';
        this.$router.push({
          name: 'userResult',
          query: { 
            status: 'error', 
            type: 'student', 
            message: this.errorMessage 
          }
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