var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient(),
    consumer = new Consumer(
        client,
        [
            { topic: 'tweetss', partition: 0}
        ],
        {
            autoCommit: false
        }
    );


consumer.on('message', function (message) {
    console.log('nmam')
    console.log(message);
});

consumer.on('error', function (err) {
    console.log(err);
})