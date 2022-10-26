import { ChangeStream, ChangeStreamDocument, Document, MongoClient } from 'mongodb'
import Configuration from '../config/index'
import stream  from 'stream'

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
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await monitorSubredditUsingEventEmitter(client, 15000);
        // await monitorPostUsingEventEmitter(client, 15000);
        // await monitorCommentsUsingEventEmitter(client, 15000);
        /**
         * An aggregation pipeline that matches on new subReddit to name and slogan
         */
        const pipeline = [
            {
                '$match': {
                    'operationType': 'insert',
                    'fullDocument.name': 'Programming redefined',
                    'fullDocument.slogan': 'We live for humour'
                }
            }
        ];

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

async function monitorSubredditUsingEventEmitter (client: MongoClient, timeInMs = 60000, pipeline = [] ) {
    const collection = client.db("Reddit-clone_sample").collection('subreddits');
    const changeStream = collection.watch(pipeline);
    changeStream.on('change', (next) => {
        console.log(next);
    });
    await closeChangeStream(timeInMs, changeStream);
}


/**
 * Close the given change stream after the given amount of time
 * @param {*} timeInMs The amount of time in ms to monitor listings
 * @param {*} changeStream The open change stream that should be closed
 */
function closeChangeStream(timeInMs = 60000, changeStream: ChangeStream<Document, ChangeStreamDocument<Document>>) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve();
        }, timeInMs)
    })
};

