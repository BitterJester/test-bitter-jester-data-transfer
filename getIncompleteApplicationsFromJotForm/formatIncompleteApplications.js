const extractAnswersFromJotform = require('../writeToS3FromJotForm/extractAnswersFromJotforrm');

const jotformAnswerMap = {
    applicantName: '3',
    bandName: '39',
    primaryEmailAddress: '40',
    relationshipToBand: '44'
};

const format = (applications) => {
    const extractedApplications = extractAnswersFromJotform.extractAnswersFromJotform(applications, jotformAnswerMap);

    return {
        incompleteApplications: extractedApplications
    };
};

module.exports = {
    format: format
}