const extractAnswersFromJotform = require('../writeToS3FromJotForm/extractAnswersFromJotforrm');

const jotformAnswerMap = {
    songName: '543',
    bandName: '39',
    primaryEmailAddress: '289',
    songUrl: '252',
    bandPhotoUrl: '253',
    lyricsUrl: '540',
    songDescription: '539'
};

const format = (applications) => {
    const extractedApplications = extractAnswersFromJotform.extractAnswersFromJotform(applications, jotformAnswerMap)
        .map(item => {
            item.songUrl = encodeURI(item.songUrl[0]);
            item.bandPhotoUrl = encodeURI(item.bandPhotoUrl[0]);
            item.lyricsUrl = encodeURI(item.lyricsUrl[0]);
            item.songDescription = item.songDescription ? item.songDescription.replace(/&#039;/g, "'") : '';
            return item;
        });

    return {
        originalSongs: extractedApplications
    };
};

module.exports = {
    format: format
}