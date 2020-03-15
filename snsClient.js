const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

class SNSClient {
    constructor(){
        this.client = new AWS.SNS({
            accessKeyId: process.env.AWS_ACCESS_ID,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            apiVersion: '2010-03-31'
        });
    }

    async publishSNSMessage(snsMessage) {
        const publishTextPromise = this.client.publish(snsMessage).promise();

        await publishTextPromise.then(function (data) {
            console.log(`Message ${snsMessage.Message} send sent to the topic ${snsMessage.TopicArn}`);
            console.log("MessageID is " + data.MessageId);
        }).catch(function (err) {
            console.error(err, err.stack);
        });
    }
}

module.exports = {
    SNSClient: SNSClient
};