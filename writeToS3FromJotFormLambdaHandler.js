require('dotenv').config();
const writeToS3FromJotForm = require('./writeToS3FromJotForm/writeToS3FromJotForm');
const SNSClient = require('./snsClient').SNSClient;

const BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID = 193466400251149;
const APPLICATIONS_UPDATED_SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:771384749710:BandApplicationUpdatedSnsTopic';

exports.handler = async function (event) {
    await writeToS3FromJotForm.getFormSubmissions(
        BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID
    );

    await new SNSClient().publishSNSMessage({
        Message: 'hi',
        TopicArn: APPLICATIONS_UPDATED_SNS_TOPIC_ARN
    });

    console.log('DONE');
};