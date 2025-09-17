import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    studentID: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    house: { type: String, required: true },
    grade: { type: Number, default: 0.0 }
});

const Student = mongoose.model('Student', studentSchema);
export default Student;