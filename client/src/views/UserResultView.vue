<template>
  <div class="magical-container single-column">
    <template v-if="status === 'success'">
      <img src="/images/Hogwartscrest.webp" alt="Hogwarts Crest" class="hogwarts-crest" />

      <template v-if="type === 'user'">
        <h1>Welcome Back, User!</h1>
        <p class="magical-text">Login Successful</p>
        <p class="spell-text">Your magical journey continues!</p>
        <div class="registration-details">
          <p><strong>User ID:</strong> {{ currentUserData.userID }}</p>
          <p><strong>Name:</strong> {{ currentUserData.firstName }} {{ currentUserData.lastName }}</p>
        </div>
      </template>

      <template v-else-if="type === 'student'">
        <h1>Welcome Back, Student!</h1>
        <p class="magical-text">Login Successful</p>
        <p class="spell-text">Your magical journey continues!</p>
        <div class="registration-details">
          <p><strong>Student ID:</strong> {{ currentUserData.studentID }}</p>
          <p><strong>Name:</strong> {{ currentUserData.firstName }} {{ currentUserData.lastName }}</p>
          <p><strong>House:</strong> {{ currentUserData.house }}</p>
          <p><strong>Current Grade:</strong> {{ currentUserData.grade }}</p>
        </div>
      </template>

      <template v-else-if="type === 'admin'">
        <h1>Welcome Back, Admin!</h1>
        <p class="magical-text">Faculty Login Successful</p>
        <p class="spell-text">Ready to inspire young magical minds!</p>
        <div class="registration-details">
          <p><strong>Admin ID:</strong> {{ currentUserData.adminID }}</p>
          <p><strong>Name:</strong> Prof. {{ currentUserData.firstName }} {{ currentUserData.lastName }}</p>
          <p><strong>House Head:</strong> {{ currentUserData.house }}</p>
        </div>
        
        <hr class="magical-divider">

        <div class="admin-panel" v-if="students.length > 0">
          <h2>Student Grading Panel</h2>
          <p>Select a student to update their grade or delete them.</p>

          <form @submit.prevent="updateStudentGrade">
            <label for="studentSelect">Select Student:</label>
            <select id="studentSelect" v-model="selectedStudentId">
              <option value="" disabled>Choose a student</option>
              <option v-for="student in students" :key="student.studentID" :value="student.studentID">
                {{ student.firstName }} {{ student.lastName }} (Grade: {{ student.grade }})
              </option>
            </select>
            
            <label for="newGrade">New Grade:</label>
            <input type="number" id="newGrade" v-model="newGrade" class="magical-input" step="0.1" min="0" max="100" />
            
            <div class="admin-actions">
              <input type="submit" value="Update Grade" :disabled="!selectedStudentId || newGrade === null" />
              <button type="button" @click="deleteStudent" :disabled="!selectedStudentId">Delete Student</button>
            </div>
          </form>
          <p v-if="gradeMessage" :class="gradeMessageClass">{{ gradeMessage }}</p>
        </div>
        <p v-else class="magical-text">No students found.</p>
      </template>

      <nav style="margin-top: 30px;">
        <router-link to="/" class="magical-button">Return to Hogwarts Portal</router-link>
      </nav>
    </template>

    <template v-else-if="status === 'error'">
      <img src="/images/Hogwartscrest.webp" alt="Hogwarts Crest" class="hogwarts-crest" />
      <template v-if="type === 'user' || type === 'student' || type === 'admin'">
        <h1>Access Denied!</h1>
        <p class="magical-text">{{ authenticationFailedMessage }}</p>
        <p>{{ allCredentialsRequiredMessage }}</p>
        <p class="spell-text">Please provide complete information.</p>
        <div class="error-details">
          <h2>Missing Information</h2>
          <p>{{ missingInfoMessage }}</p>
        </div>
        <nav>
          <router-link :to="tryAgainLink" class="magical-button">Try Again</router-link>
        </nav>
      </template>
      
    </template>
  </div>
</template>

<script>
export default {
  name: 'UserResultView',
  data() {
    return {
      students: [],
      selectedStudentId: '',
      newGrade: null,
      gradeMessage: '',
      gradeMessageClass: '',
      routerStateData: null
    };
  },
  computed: {
    status() {
      return this.$route.query.status;
    },
    type() {
      return this.$route.query.type;
    },
    currentUserData() {
      // Prefer data from router state if available, otherwise fallback to route query
      return this.routerStateData || this.$route.query;
    },
    authenticationFailedMessage() {
      if (this.type === 'user') return 'User Authentication Failed';
      if (this.type === 'student') return 'Student Authentication Failed';
      if (this.type === 'admin') return 'Faculty Authentication Failed';
      return 'Authentication Failed';
    },
    allCredentialsRequiredMessage() {
      if (this.type === 'user') return 'All user credentials are required for magical authentication!';
      if (this.type === 'student') return 'All student credentials are required for magical authentication!';
      if (this.type === 'admin') return 'All admin credentials are required for magical authentication!';
      return 'All credentials are required for magical authentication!';
    },
    missingInfoMessage() {
      if (this.type === 'user') return 'Please ensure you provide your User ID, First Name, and Last Name.';
      if (this.type === 'student') return 'Please ensure you provide your Student ID, First Name, Last Name, and House.';
      if (this.type === 'admin') return 'Please ensure you provide your Admin ID, First Name, Last Name, and House Affiliation.';
      return 'Please ensure all required information is provided.';
    },
    tryAgainLink() {
      if (this.type === 'user') return '/user-form';
      if (this.type === 'student') return '/student-form';
      if (this.type === 'admin') return '/admin-form';
      return '/';
    }
  },
  async created() {
    console.log('Route query:', this.$route.query);
    console.log('Router state:', history.state);
    
    // Use history.state.userData if available, as it might contain more complete data
    if (history.state && history.state.userData) {
      this.routerStateData = history.state.userData;
      console.log('Using router state data:', this.routerStateData);
    } else {
      // Fallback to route.query if history.state.userData is not present
      this.routerStateData = this.$route.query;
      console.log('Using route query data:', this.routerStateData);
    }
    
    // Only fetch students if the user is an admin and login was successful
    if (this.type === 'admin' && this.status === 'success') {
      await this.fetchStudents();
    }
  },
  watch: {
    // Watch for route changes to ensure data is updated correctly
    '$route': {
      immediate: true, // Run immediately on component mount
      async handler(newRoute) {
        // Re-evaluate routerStateData if the route changes
        if (history.state && history.state.userData) {
          this.routerStateData = history.state.userData;
        } else {
          this.routerStateData = newRoute.query;
        }
        
        // Re-fetch students if the route changes to admin success status
        if (newRoute.query.type === 'admin' && newRoute.query.status === 'success') {
          await this.fetchStudents();
        }
      }
    }
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await fetch('/api/students');
        const data = await response.json();
        
        if (response.ok && data.success) {
          this.students = data.data;
          console.log('Students fetched:', this.students);
        } else {
          console.error('Failed to fetch students:', data.message);
          this.students = [];
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        this.students = [];
      }
    },
    
    async updateStudentGrade() {
      this.gradeMessage = '';
      this.gradeMessageClass = '';
      
      if (!this.selectedStudentId || this.newGrade === null) {
        this.gradeMessage = 'Please select a student and enter a grade.';
        this.gradeMessageClass = 'error-message';
        return;
      }

      try {
        const response = await fetch('/api/update-grade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentID: this.selectedStudentId,
            grade: this.newGrade
          })
        });

        const data = await response.json();
        
        if (response.ok) {
          this.gradeMessage = data.message;
          this.gradeMessageClass = 'success-message';
          
          // Update the student in the local list
          if (data.updatedStudent) {
            const studentIndex = this.students.findIndex(s => s.studentID === this.selectedStudentId);
            if (studentIndex !== -1) {
              this.students[studentIndex] = data.updatedStudent;
            }
          }
          
          this.selectedStudentId = '';
          this.newGrade = null;
        } else {
          this.gradeMessage = data.message || 'Failed to update grade.';
          this.gradeMessageClass = 'error-message';
        }
      } catch (error) {
        console.error('Error updating grade:', error);
        this.gradeMessage = 'Failed to connect to the server.';
        this.gradeMessageClass = 'error-message';
      }
    },

    // delete student
    async deleteStudent() {
      if (!this.selectedStudentId) {
        this.gradeMessage = 'Please select a student to delete.';
        this.gradeMessageClass = 'error-message';
        return;
      }

      // Optional: Add a confirmation dialog for deletion
      const confirmDelete = confirm(`Are you sure you want to delete student with ID ${this.selectedStudentId}? This action cannot be undone.`);
      if (!confirmDelete) {
        return;
      }

      try {
        const response = await fetch(`/api/students/${this.selectedStudentId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        
        if (response.ok) {
          this.gradeMessage = data.message;
          this.gradeMessageClass = 'success-message';
          
          // Remove the deleted student from the local list
          this.students = this.students.filter(s => s.studentID !== this.selectedStudentId);
          
          // Clear selection and message
          this.selectedStudentId = '';
          this.newGrade = null; // Also reset grade input if it was filled
        } else {
          this.gradeMessage = data.message || 'Failed to delete student.';
          this.gradeMessageClass = 'error-message';
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        this.gradeMessage = 'Failed to connect to the server.';
        this.gradeMessageClass = 'error-message';
      }
    }
  }
}
</script>

<style scoped>
.response-page {
  text-align: center;
}
.error-page {
  color: #ff6b6b;
}
.error-404 {
  font-size: 5rem;
  margin: 0;
  line-height: 1;
  color: #ff6b6b;
}
.magical-divider {
  border: 1px solid #d4af37;
  width: 50%;
  margin: 20px auto;
}
.admin-panel form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.admin-actions {
  display: flex;
  flex-direction: column; /* This will stack items vertically */
  justify-content: center;
  gap: 10px;
  align-items: center; /* This will center items horizontally when stacked */
}

.admin-panel label {
  color: #d4af37;
}
.admin-panel input[type="number"] {
  width: 100%;
}
.success-message {
  color: #4CAF50;
  margin-top: 15px;
  text-align: center;
}
.error-message {
  color: #ff6b6b;
  margin-top: 15px;
  text-align: center;
}
.magical-input {
  background-color: #f7e7c1;
  border: 2px solid #8e6f43;
  border-radius: 5px;
  padding: 10px;
  font-family: 'MagicFont', sans-serif;
  color: #333;
  width: 100%;
  box-sizing: border-box; 
  transition: all 0.3s ease;
}

.magical-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
}

</style>