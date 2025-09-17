import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './models/User.js';
import Student from './models/Student.js';
import Admin from './models/Admin.js';

// for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const dbURI = process.env.MONGODB_URI;

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
// const users = [];
// const students = [];
// const admins = [];

if (!dbURI) {
    console.error("MONGODB_URI is not defined in the .env file!");
    process.exit(1); // Exit the process if the URI is missing
}

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
// user login
app.post('/api/user-login', async (req, res) => {
    const { userID, firstName, lastName } = req.body;
    try {
        if (!userID || !firstName || !lastName) {
            return res.status(400).json({ success: false, message: 'All user credentials are required.' });
        }
        let existingUser = await User.findOne({ userID });
        if (!existingUser) {
            existingUser = await User.create({ userID, firstName, lastName });
            console.log("New User Created:", existingUser);
        }
        res.json({ success: true, message: 'Login successful!', data: existingUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
});

// student login
app.post('/api/student-login', async (req, res) => {
    const { studentID, firstName, lastName, house } = req.body;
    try {
        if (!studentID || !firstName || !lastName || !house) {
            return res.status(400).json({ success: false, message: 'All student credentials are required.' });
        }
        let existingStudent = await Student.findOne({ studentID });
        if (!existingStudent) {
            existingStudent = await Student.create({ studentID, firstName, lastName, house });
            console.log("New Student Created:", existingStudent);
        }
        res.json({ success: true, message: 'Login successful!', data: existingStudent });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
});

// admin login
app.post('/api/admin-login', upload.single('profilePicture'), async (req, res) => {
    const { adminID, firstName, lastName, house } = req.body;
    const profilePicture = req.file;

    try {
        if (!adminID || !firstName || !lastName || !house) {
            return res.status(400).json({ success: false, message: 'All admin credentials are required.' });
        }
        let existingAdmin = await Admin.findOne({ adminID });
        if (!existingAdmin) {
            existingAdmin = await Admin.create({ 
                adminID, 
                firstName, 
                lastName, 
                house, 
                profilePicturePath: profilePicture ? profilePicture.path : '' 
            });
            console.log("New Admin Created:", existingAdmin);
        }
        res.json({ success: true, message: 'Login successful!', data: existingAdmin });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
});

// new api route: get all students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find({});
        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
});

// new api route: get all admins 
app.get('/api/admins', async (req, res) => {
    try {
        const admins = await Admin.find({});
        res.json({ success: true, data: admins });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
});

// new api route: get all users 
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
});

// new api route: update student grade
app.post('/api/update-grade', async (req, res) => {
    const { studentID, grade } = req.body;
    try {
        const student = await Student.findOne({ studentID });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }
        student.grade = parseFloat(grade) || 0.0;
        await student.save();
        console.log(`Updated grade for ${student.firstName} ${student.lastName} to ${student.grade}`);
        res.json({ success: true, message: 'Grade updated successfully!', updatedStudent: student });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
    }
});

// new api route: delete student
app.delete('/api/students/:studentID', async (req, res) => {
    const { studentID } = req.params;
    try {
        const deletedStudent = await Student.findOneAndDelete({ studentID });

        if (!deletedStudent) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        console.log(`Deleted student with ID: ${studentID}`);
        res.json({ success: true, message: 'Student deleted successfully!', deletedStudent });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ success: false, message: 'Server error.', error: error.message });
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