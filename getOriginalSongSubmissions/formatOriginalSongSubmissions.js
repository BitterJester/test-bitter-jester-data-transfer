const extractAnswersFromJotform = require('../writeToS3FromJotForm/extractAnswersFromJotforrm');

const jotformAnswerMap = {
    songName: '543',
    bandName: '39',
    primaryEmailAddress: '289',
    songUrl: '252',
    bandPhotoUrl: '253'
};

const format = (applications) => {
    const extractedApplications = extractAnswersFromJotform.extractAnswersFromJotform(applications, jotformAnswerMap);

    return {
        originalSongs: extractedApplications
    };
};

module.exports = {
    format: format
}