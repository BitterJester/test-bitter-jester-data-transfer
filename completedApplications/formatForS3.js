const extractAnswersFromJotform = require('../writeToS3FromJotForm/extractAnswersFromJotforrm');

const jotformAnswerMap = {
    bandName: '39',
    primaryEmailAddress: '289',
    firstChoiceFridayNight: '77',
    secondChoiceFridayNight: '78',
    isBandAvailableOnAllFridays: '232',
    primaryPhoneNumber: '312',
    citiesRepresented: '315',
    unavailableFridayNights: '80',
    referencedBands: '303'
};

const format = (applications, jotformId) => {

    const convertIsBandAvailableOnFridays = (isBandAvailableStringField) => {
        return !isBandAvailableStringField.toLowerCase().includes('not available');
    };

    const extractedApplications = extractAnswersFromJotform.extractAnswersFromJotform(applications, jotformAnswerMap);
    const cleanedApplications = extractedApplications.map(app => {
        const bandAvailableOnAllFridays = app.isBandAvailableOnAllFridays;
        const firstChoiceFridayNight = app.firstChoiceFridayNight;
        const secondChoiceFridayNight = app.secondChoiceFridayNight;
        app.primaryPhoneNumber = app.primaryPhoneNumber.full;

        if(bandAvailableOnAllFridays){
            app.isBandAvailableOnAllFridays = convertIsBandAvailableOnFridays(bandAvailableOnAllFridays);
        }

        if(!firstChoiceFridayNight){
            app.firstChoiceFridayNight = 'Available Every Friday'
        }

        if(!secondChoiceFridayNight){
            app.secondChoiceFridayNight = ''
        }
        return app;
    });

    return {
        completedApplications: cleanedApplications,
        jotformId
    };
};

module.exports = {
    format: format
}