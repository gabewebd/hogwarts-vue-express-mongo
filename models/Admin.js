import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    adminID: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    house: { type: String, required: true },
    profilePicturePath: { type: String, default: '' }
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;