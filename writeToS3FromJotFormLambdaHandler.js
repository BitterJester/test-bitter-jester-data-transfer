require('dotenv').config();
const writeToS3FromJotForm = require('./writeToS3FromJotForm/writeToS3FromJotForm');
const SNSClient = require('./snsClient').SNSClient;
const formatForS3 = require('./completedApplications/formatForS3');

const BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID = 193466400251149;
const OUTPUT_FILE_NAME = 'bitter-jester-test.json';

const snsClient = new SNSClient();

exports.handler = async function (event) {
    await writeToS3FromJotForm.getFormSubmissions(
        BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID,
        OUTPUT_FILE_NAME,
        formatForS3.format
    );

    const snsMessage = {
        TopicArn: 'arn:aws:sns:us-east-1:771384749710:BandApplicationUpdatedSnsTopic',
        Message: 'Applications Updated'
    };

    await snsClient.publishSNSMessage(snsMessage);
};