const extractAnswersFromJotform = require('../writeToS3FromJotForm/extractAnswersFromJotforrm');

const jotformAnswerMap = {
    firstName: '87',
    lastName: '88',
    availableNights: '12',
    availableNights2: '69',
    updatedEmail: '70',
    updatedCell: '71',
    email: '35',
    cellNumber: '33'
};

const format = (applications, jotformId) => {
    const extractedApplications = extractAnswersFromJotform.extractAnswersFromJotform(applications, jotformAnswerMap);
    const cleanedApplications = extractedApplications.map(app => {
        return {
            firstName: app.firstName,
            lastName: app.lastName,
            availableNights: app.availableNights ? app.availableNights : app.availableNights2,
            email: app.email ? app.email : app.updatedEmail,
            cellNumber: app.cellNumber ? app.cellNumber.full : app.updatedCell.full
        };
    });

    return {
        judgeApplications: cleanedApplications,
        jotformId
    };
};

module.exports = {
    format: format
}