import mongoose, { Schema } from 'mongoose';

const subredditSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slogan: { type: String, required: true },
    _creator: {type: Schema.Types.ObjectId, ref: 'userData' },
},{timestamps: true});

const Subreddit = mongoose.model('subreddit', subredditSchema);

export default Subreddit;