const kafka = require('kafka-node');

const Consumer = kafka.Consumer,
    client = new kafka.KafkaClient('localhost:9092'),
    consumer = new Consumer(
        client, [{ topic: 'tweets'}], { autoCommit: false });

consumer.on('message', function (message) {
    console.log(message);
});