<template>
  <div class="magical-container single-column">
    <div class="form-header">
      <h1>Admin Login</h1>
    </div>

    <div class="form-content">
      <form @submit.prevent="handleLogin">
        <label for="adminID">Admin ID:</label>
        <input type="text" id="adminID" v-model="form.adminID" placeholder="Enter your faculty ID" required />

        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" v-model="form.firstName" placeholder="Enter your first name" required />

        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" v-model="form.lastName" placeholder="Enter your last name" required />

        <label for="house">House Affiliation:</label>
        <select id="house" v-model="form.house" required>
          <option value="">Select your house affiliation</option>
          <option value="Gryffindor">Gryffindor</option>
          <option value="Hufflepuff">Hufflepuff</option>
          <option value="Ravenclaw">Ravenclaw</option>
          <option value="Slytherin">Slytherin</option>
          <option value="None">No House Affiliation</option>
        </select>
        
        <label for="profilePicture">Your identity:</label>
        <input type="file" id="profilePicture" @change="handleFileUpload" required />

        <input type="submit" value="Access Admin Dashboard" />
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
  name: 'AdminFormView',
  data() {
    return {
      form: {
        adminID: '',
        firstName: '',
        lastName: '',
        house: '',
        profilePicture: null
      },
      errorMessage: ''
    };
  },
  methods: {
    handleFileUpload(event) {
      this.form.profilePicture = event.target.files[0];
    },
    async handleLogin() {
      this.errorMessage = '';
      try {
        const formData = new FormData();
        formData.append('adminID', this.form.adminID);
        formData.append('firstName', this.form.firstName);
        formData.append('lastName', this.form.lastName);
        formData.append('house', this.form.house);
        formData.append('profilePicture', this.form.profilePicture);

        const response = await fetch('/api/admin-login', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          // Since the server no longer includes students in admin login response,
          // we'll pass admin data through router state and fetch students separately in UserResultView
          this.$router.push({
            name: 'userResult',
            query: { 
              status: 'success', 
              type: 'admin'
            },
            // Pass the admin data through router state
            state: { userData: data.data }
          });
        } else {
          this.errorMessage = data.message || 'An unknown error occurred.';
          this.$router.push({
            name: 'userResult',
            query: { 
              status: 'error', 
              type: 'admin', 
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
            type: 'admin', 
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