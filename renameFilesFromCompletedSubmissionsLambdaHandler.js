require('dotenv').config();
const formatForS3 = require('./completedApplications/formatForS3');
const {getFormFiles} = require("./renameFilesFromCompletedSubmissions/renameFilesFromCompletedSubmissions");

const BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID = 211443460736149;
const OUTPUT_FILE_NAME = 'completed-submissions.json';

exports.handler = async function (event) {
    const message = event.Records[0].Sns.Message;
    const messageParts = message.split('&');
    const competition = messageParts[0];
    const shouldDownloadFiles = Boolean(messageParts[1]);
    await getFormFiles(BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID, competition, shouldDownloadFiles);
};