import mongoose, {Schema} from 'mongoose';

const postSchema = new mongoose.Schema({
   title: {type: String, required: true},
   text: String,
   isDeleted: { type: Boolean, default: false },
   _creator: {type: Schema.Types.ObjectId, ref: 'userData' },
   _subreddit: {type: Schema.Types.ObjectId, ref: 'subreddit'},
   _comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }]
},{timestamps: true});

const Post = mongoose.model('post', postSchema);

export default Post;