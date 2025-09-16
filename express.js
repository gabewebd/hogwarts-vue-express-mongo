import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'client/public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ storage: storage });

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static('client/public'));

// in-memory database
const users = [];
const students = [];
const admins = [];

// API Routes
// user login
app.post('/api/user-login', (req, res) => {
    const { userID, firstName, lastName } = req.body;
    if (userID && firstName && lastName) {
        let existingUser = users.find(u => u.userID === userID);
        if (!existingUser) {
            existingUser = { userID, firstName, lastName };
            users.push(existingUser);
            console.log("New User Created:", existingUser);
        }
        res.json({ success: true, message: 'Login successful!', data: existingUser });
    } else {
        res.status(400).json({ success: false, message: 'All user credentials are required.' });
    }
});

// student login
app.post('/api/student-login', (req, res) => {
    const { studentID, firstName, lastName, house } = req.body;
    if (studentID && firstName && lastName && house) {
        let existingStudent = students.find(s => s.studentID === studentID);
        if (!existingStudent) {
            existingStudent = { studentID, firstName, lastName, house, grade: 0.0, profilePicturePath: '' };
            students.push(existingStudent);
            console.log("New Student Created:", existingStudent);
        }
        res.json({ success: true, message: 'Login successful!', data: existingStudent });
    } else {
        res.status(400).json({ success: false, message: 'All student credentials are required.' });
    }
});

// admin login
app.post('/api/admin-login', upload.single('profilePicture'), (req, res) => {
    const { adminID, firstName, lastName, house } = req.body;
    const profilePicture = req.file;

    if (adminID && firstName && lastName && house) {
        let existingAdmin = admins.find(a => a.adminID === adminID);
        if (!existingAdmin) {
            existingAdmin = { adminID, firstName, lastName, house, profilePicturePath: profilePicture ? profilePicture.path : '' };
            admins.push(existingAdmin);
            console.log("New Admin Created:", existingAdmin);
        }
        
        // sends back the logged-in admin's data
        const responseData = {
          ...existingAdmin,
          profilePicturePath: existingAdmin.profilePicturePath || ''
        };
        
        res.json({ success: true, message: 'Login successful!', data: responseData });
    } else {
        res.status(400).json({ success: false, message: 'All admin credentials are required.' });
    }
});

// new api route: get all students
app.get('/api/students', (req, res) => {
    res.json({ success: true, data: students });
});

// new api route: get all admins 
app.get('/api/admins', (req, res) => {
    res.json({ success: true, data: admins });
});

// new api route: get all users 
app.get('/api/users', (req, res) => {
    res.json({ success: true, data: users });
});

// new api route: update student grade
app.post('/api/update-grade', (req, res) => {
    const { studentID, grade } = req.body;
    const student = students.find(s => s.studentID === studentID);

    if (student) {
        student.grade = parseFloat(grade) || 0.0;
        console.log(`Updated grade for ${student.firstName} ${student.lastName} to ${student.grade}`);
        res.json({ success: true, message: 'Grade updated successfully!', updatedStudent: student });
    } else {
        res.status(404).json({ success: false, message: 'Student not found.' });
    }
});

// catch-all route to serve the Vue app
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const port = 5000;
app.listen(port, () => {
    console.log(`Hogwarts Portal running on port ${port}`);
});