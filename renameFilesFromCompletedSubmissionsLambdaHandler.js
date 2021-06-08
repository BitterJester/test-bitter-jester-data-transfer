require('dotenv').config();
const formatForS3 = require('./completedApplications/formatForS3');
const {getFormFiles} = require("./renameFilesFromCompletedSubmissions/renameFilesFromCompletedSubmissions");

const BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID = 211443460736149;
const OUTPUT_FILE_NAME = 'completed-submissions.json';

exports.handler = async function (event) {
    const competition = event.Records[0].Sns.Message;
    await getFormFiles(BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID, competition);
};