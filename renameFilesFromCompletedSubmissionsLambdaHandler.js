require('dotenv').config();
const {getFormFiles} = require("./renameFilesFromCompletedSubmissions/renameFilesFromCompletedSubmissions");

const BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID = 211443460736149;

exports.handler = async function (event) {
    let competition;
    let shouldDownloadFiles = false;
    if(event.Records){
        const message = event.Records[0].Sns.Message;
        const messageParts = message.split('&');
        competition = messageParts[0];
        shouldDownloadFiles = Boolean(messageParts[1]);
    } else {
        competition = `competition=${event.competitionId}`;
    }
    await getFormFiles(BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID, competition, shouldDownloadFiles);
};