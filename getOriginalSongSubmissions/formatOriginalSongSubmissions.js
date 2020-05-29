const extractAnswersFromJotform = require('../writeToS3FromJotForm/extractAnswersFromJotforrm');
const S3Client = require('s3Client').S3Client;

const jotformAnswerMap = {
    songName: '543',
    bandName: '39',
    primaryEmailAddress: '289',
    songUrl: '252',
    bandPhotoUrl: '253',
    lyricsUrl: '540',
    songDescription: '539'
};

const format = async (applications) => {
    const extractedApplications = extractAnswersFromJotform.extractAnswersFromJotform(applications, jotformAnswerMap)
        .map(item => {
            item.songUrl = encodeURI(item.songUrl[0]);
            item.bandPhotoUrl = encodeURI(item.bandPhotoUrl[0]);
            item.lyricsUrl = encodeURI(item.lyricsUrl[0]);
            item.songDescription = item.songDescription ? item.songDescription.replace(/&#039;/g, "'") : '';
            return item;
        });

    const originalSongSubmissions = await new S3Client().getObject('bitter-jester-test', 'original-song-submissions.json');
    extractedApplications.forEach(song => {
        const numberOfSongsForBand = originalSongSubmissions.originalSongs.filter(app => app.bandName === song.bandName).length;

        if(numberOfSongsForBand === 0){
            song.scheduledWeek = 1;
            originalSongSubmissions.originalSongs.push(song);
        }
    });
    return {
        originalSongs: extractedApplications
    };
};

module.exports = {
    format: format
}