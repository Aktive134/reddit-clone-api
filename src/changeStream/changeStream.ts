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

// /**
//  * Monitor listings in the listingsAndReviews collections for changes
//  * This function uses the on() function from the EventEmitter class to monitor changes
//  * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
//  * @param {Number} timeInMs The amount of time in ms to monitor listings
//  * @param {Object} pipeline An aggregation pipeline that determines which change events should be output to the console
//  */
// async function monitorListingsUsingEventEmitter(client: MongoClient, timeInMs = 60000, pipeline = []) {
//     const collection = client.db("sample_airbnb").collection("listingsAndReviews");

//     // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#watch for the watch() docs
//     const changeStream = collection.watch(pipeline);

//     // ChangeStream inherits from the Node Built-in Class EventEmitter (https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_class_eventemitter).
//     // We can use EventEmitter's on() to add a listener function that will be called whenever a change occurs in the change stream.
//     // See https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_emitter_on_eventname_listener for the on() docs.
//     changeStream.on('change', (next: any) => {
//         console.log(next);
//     });

//     // Wait the given amount of time and then close the change stream
//     await closeChangeStream(timeInMs, changeStream);
// }

// /**
//  * Monitor listings in the listingsAndReviews collections for changes
//  * This function uses the hasNext() function from the MongoDB Node.js Driver's ChangeStream class to monitor changes
//  * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
//  * @param {Number} timeInMs The amount of time in ms to monitor listings
//  * @param {Object} pipeline An aggregation pipeline that determines which change events should be output to the console
//  */
// async function monitorListingsUsingHasNext(client: { db: (arg0: string) => { (): any; new(): any; collection: { (arg0: string): any; new(): any; }; }; }, timeInMs = 60000, pipeline = []) {
//     const collection = client.db("sample_airbnb").collection("listingsAndReviews");

//     // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#watch for the watch() docs
//     const changeStream = collection.watch(pipeline);

//     // Set a timer that will close the change stream after the given amount of time
//     // Function execution will continue because we are not using "await" here
//     closeChangeStream(timeInMs, changeStream);

//     // We can use ChangeStream's hasNext() function to wait for a new change in the change stream.
//     // See https://mongodb.github.io/node-mongodb-native/3.6/api/ChangeStream.html for the ChangeStream docs.
//     try {
//         while (await changeStream.hasNext()) {
//             console.log(await changeStream.next());
//         }
//     } catch (error) {
//         if (changeStream.isClosed()) {
//             console.log("The change stream is closed. Will not wait on any more changes.")
//         } else {
//             throw error;
//         }
//     }
// }

// /**
//  * Monitor listings in the listingsAndReviews collection for changes
//  * This function uses the Stream API (https://nodejs.org/api/stream.html) to monitor changes
//  * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
//  * @param {Number} timeInMs The amount of time in ms to monitor listings
//  * @param {Object} pipeline An aggregation pipeline that determines which change events should be output to the console
//  */
// async function monitorListingsUsingStreamAPI(client: { db: (arg0: string) => { (): any; new(): any; collection: { (arg0: string): any; new(): any; }; }; }, timeInMs = 60000, pipeline = []) {
//     const collection = client.db('sample_airbnb').collection('listingsAndReviews');

//     // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#watch for the watch() docs
//     const changeStream = collection.watch(pipeline);

//     // See https://mongodb.github.io/node-mongodb-native/3.6/api/ChangeStream.html#stream for the stream() docs
//     changeStream.stream().pipe(
//         new stream.Writable({
//             objectMode: true,
//             write: function (doc, _, cb) {
//                 console.log(doc);
//                 cb();
//             }
//         })
//     );

//     // Wait the given amount of time and then close the change stream
//     await closeChangeStream(timeInMs, changeStream);
// }