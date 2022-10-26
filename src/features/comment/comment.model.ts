import mongoose, { Schema } from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    _creator: { type: Schema.Types.ObjectId, ref: 'userData' },
    isDeleted: { type: Boolean, default: false},
    _post: { type: Schema.Types.ObjectId, ref: 'post' }
},{timestamps: true});

const Comment = mongoose.model('comment', commentSchema);

export default Comment;