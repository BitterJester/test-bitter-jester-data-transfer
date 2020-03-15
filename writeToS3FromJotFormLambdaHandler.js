require('dotenv').config();
const writeToS3FromJotForm = require('./writeToS3FromJotForm/writeToS3FromJotForm');
const SNSClient = require('./snsClient').SNSClient;

exports.handler = async function(event) {
    await writeToS3FromJotForm.getFormSubmissions();
    await new SNSClient().publishSNSMessage({
        Message: 'hi',
        TopicArn: 'arn:aws:sns:us-east-1:771384749710:BandApplicationUpdatedSnsTopic'
    });

    console.log('DONE')
}