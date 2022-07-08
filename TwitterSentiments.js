
const { Kafka } = require('kafkajs')
const dotenv = require('dotenv');
var Twitter = require('twitter');

dotenv.config();


const kafka = new Kafka({
    clientId: 'twitter-retrieval-app',
    brokers: ['localhost:9092', 'localhost:9093']
})
const producer = kafka.producer();

producer.connect();

var client = new Twitter({
    consumer_key: 'fxNXwf6gEPlC76i0fX4Flg6BP',
    consumer_secret: 'wOd2jpUIn6JtjWfwh5yjCuzAy8Lw58ntRACXmSFxFGyVFNd2Gg',
    access_token_key: '1470772200189927433-gQVgFMXWpE1q8iNKFtfYliCmI1cVZI',
    access_token_secret: 'IbQ8a0HLoXPXE8jJ2DNoydPzR28jAmclxJ6YMQsknmji7'
});

// var stream = client.stream('statuses/filter',{
//     track: 'coronavirus,covid-19, covid19',
//     language: 'en',
//     tweet_mode: 'extended'
// });
client.stream('statuses/filter', { 'locations': '-180,-90,180,90', 'track': 'coronavirus,covid-19, covid19' }, function (s) {
    stream = s;
    stream.on('data', function (data) {
        if (data.coordinates && data.text && data.retweeted_status === undefined) {
            if (data.coordinates !== null) {
                //If so then build up some nice json and send out to web sockets
                console.log(data)
                var record = JSON.stringify({
                    id: data.id,
                    timestamp: data.timestamp_ms,
                    tweet64: (data.extended_tweet !== undefined) ? new Buffer.from(data.extended_tweet.full_text).toString('ascii') : new Buffer.from(data.text).toString('ascii'),
                    screen_name: data.user.screen_name,
                    url_img: data.user.profile_image_url,
                    latitude: data.coordinates.coordinates[0],
                    longitude: data.coordinates.coordinates[1],
                    lang: data.lang
                });
                if (data.text) {
                    console.log('--------------------------------');
                    console.log(data)
                    console.log('id: ', data.id);
                    console.log('timestamp_ms: ', data.timestamp_ms);
                    console.log('tweet64: ', (data.extended_tweet !== undefined) ? data.extended_tweet.full_text : data.text);
                    console.log('screen_name: ',data.user.screen_name );
                    console.log('url_img: ',data.user.profile_image_url);
                    console.log('latitude: ', data.coordinates.coordinates[0]);
                    console.log('latitude: ', data.coordinates.coordinates[1]);
                    console.log('lang: ', data.lang);
                    console.log('--------------------------------')
                }
                producer.send({
                    topic: 'tweets',
                    messages: [{
                        value: record
                    }],
                })
                    .then()
                    .catch(e => console.error(`[twitter/producer] ${e.message}`, e))

            }
        }
    })
})

// stream.on('data', function (event) {
//     if (event.text && event.retweeted_status === undefined) {
//         var record = JSON.stringify({
//             id: event.id,
//             timestamp: event['created_at'],
//             tweet64: (event.extended_tweet !== undefined) ? new Buffer.from(event.extended_tweet.full_text).toString('ascii') : new Buffer.from(event.text).toString('ascii'),
//             location: event.user.location
//         });

//         if (event.text) {
//             console.log("----------------------------------------------------------")
//             console.log(event)
//             console.log('id: ', event.user.id)
//             console.log('Tweet: ', (event.extended_tweet !== undefined) ? event.extended_tweet.full_text : event.text);
//             console.log('Location: ', event.user.location);
//             console.log("Timestamp: ", event.created_at)
//             //console.log('Full Tweet: ', event);
//             console.log("----------------------------------------------------------")
//         }
//         else {
//             console.log('No tweet text');
//         }
//         producer.send({
//             topic: 'tweets',
//             messages: [{
//                 value: record
//             }],
//         })
//             .then()
//             .catch(e => console.error(`[twitter/producer] ${e.message}`, e))
//     }
// });

// stream.on('error', function (error) {
//     throw error;
// });