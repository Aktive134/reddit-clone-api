import mongoose from 'mongoose';

const subredditSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slogan: { type: String, required: true },
    avatar: { type: String, required: false },
    cover: { type: String, required: false },
    author: { type: String, required: true },
},{timestamps: true});

const Subreddit = mongoose.model('subreddit', subredditSchema);

export default Subreddit;