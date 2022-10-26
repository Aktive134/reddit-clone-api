/**
 * This script can be used to create, update, and delete sample data.
 * This script is especially helpful when testing change streams.
 */
import { MongoClient } from 'mongodb'
import Configuration from '../config/index'

async function main() {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   */
  const uri = Configuration.Database.urlSample

  /**
   * The Mongo Client you will use to interact with your database
   * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
   * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
   * pass option { useUnifiedTopology: true } to the MongoClient constructor.
   * const client =  new MongoClient(uri, {useUnifiedTopology: true})
   */
  const client = new MongoClient(uri)

  try {
    // Connect to the MongoDB cluster
    await client.connect()

    // Make the appropriate DB calls
    const subReddit = await createSubreddit(client, {
      id: "635925e5f0f761b3c4f57a1e",
      name: 'Programming redefined',
      slogan: 'We live for humour',
    })

    const post = await createPost(client, {
      title: 'Life Hack',
      text: 'Read a page of a book a day, it helps',
    })

    const comment = await createComment(client, {
      text: 'I know right',
      postId: '6358f3880349d145f3f79b25',
    })

    await updateSubreddit(client, subReddit, {
      name: 'Real Estate',
      slogan: 'Own it',
    })
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close()
  }
}

main().catch(console.error)

/**
 * Create a new Subreddit
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the Reddit_clone_sample database
 * @param {Object} newSubreddit The new subreddit added
 * @returns {String} The id subreddit
 */
async function createSubreddit(
  client: MongoClient,
  newSubreddit: { id: string, name: string; slogan: string },
) {
  const result = await client
    .db('Reddit-clone_sample')
    .collection('subreddits')
    .insertOne(newSubreddit)
  console.log(
    `New subreddit created with the following id: ${result.insertedId}`,
  )
  return result.insertedId
}

/**
 * Update Subreddit
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the reddit-clone database
 * @param {String} subredditId The id of the listing you want to update
 * @param {object} updatedSubreddit An object containing all of the properties to be updated for the given listing
 */
async function updateSubreddit(
  client: MongoClient,
  subredditId: any,
  updatedSubreddit: { name: string; slogan: string },
) {
  const result = await client
    .db('Reddit-clone_sample')
    .collection('subreddits')
    .updateOne({ _id: subredditId }, { $set: updatedSubreddit })

  console.log(`${result.matchedCount} document(s) matched the query criteria.`)
  console.log(`${result.modifiedCount} document(s) was/were updated.`)
}

/**
 * Create a new Post
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the Reddit_clone_sample database
 * @param {Object} newPost The new subreddit added
 * @returns {String} The id Post
 */
async function createPost(
  client: MongoClient,
  newPost: { title: string; text: string },
) {
  const result = await client
    .db('Reddit-clone_sample')
    .collection('posts')
    .insertOne(newPost)
  console.log(`New Post created with the following id: ${result.insertedId}`)
  return result.insertedId
}

/**
 * Create a new Comment
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the Reddit_clone_sample database
 * @param {Object} newComment The new comment added
 * @returns {String} The id comment
 */
async function createComment(
  client: MongoClient,
  newComment: { text: string; postId: string },
) {
  const result = await client
    .db('Reddit-clone_sample')
    .collection('comments')
    .insertOne(newComment)
  console.log(`New Comment created with the following id: ${result.insertedId}`)
  return result.insertedId
}
