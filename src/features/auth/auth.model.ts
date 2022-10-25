import mongoose from 'mongoose';

const userRegistrationSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: { type: String, unique: true },
    password: String
},{timestamps: true});

const UserData = mongoose.model('userData', userRegistrationSchema);

export default UserData;