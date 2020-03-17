require('dotenv').config();
const writeToS3FromJotForm = require('./writeToS3FromJotForm/writeToS3FromJotForm');
const SNSClient = require('./snsClient').SNSClient;
const formatIncompleteApplications = require('./getIncompleteApplicationsFromJotForm/formatIncompleteApplications');

const BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID = 193466524377165;
const APPLICATIONS_UPDATED_SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:771384749710:BandApplicationUpdatedSnsTopic';
const OUTPUT_FILE_NAME = 'incomplete-applications.json';

exports.handler = async function (event) {
    await writeToS3FromJotForm.getFormSubmissions(
        BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID,
        OUTPUT_FILE_NAME,
        formatIncompleteApplications.format
    );
};