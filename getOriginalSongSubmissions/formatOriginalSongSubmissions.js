const extractAnswersFromJotform = require('../writeToS3FromJotForm/extractAnswersFromJotforrm');
const S3Client = require('s3Client').S3Client;

const jotformAnswerMap = {
    songName: '543',
    bandName: '39',
    primaryEmailAddress: '289',
    bandPhotoUrl: '253',
    lyricsUrl: '540',
    songDescription: '539'
};

const format = async (applications) => {
    const formatLyrics = (lyricsUrl) => {
      const domain = 'https://www.jotform.com/uploads/BitterJester/';
      const domainRemoved = lyricsUrl.replace(domain, '');
        const urlParamParts = domainRemoved.split('/');
        urlParamParts[2] = encodeURIComponent(urlParamParts[2]);
      return `${domain}${urlParamParts.join('/')}`
    };

    const formatSongDescription = (item) => {
        return item.replace(/&#039;/g, "'")
    };

    const extractedApplications = extractAnswersFromJotform.extractAnswersFromJotform(applications, jotformAnswerMap)
        .map(item => {
            item.bandPhotoUrl = encodeURI(item.bandPhotoUrl[0]);
            item.lyricsUrl = formatLyrics(encodeURI(item.lyricsUrl[0]));
            item.songDescription = item.songDescription ? formatSongDescription(item.songDescription) : '';
            return item;
        });

    const originalSongSubmissions = await new S3Client().getObject('bitter-jester-lake', 'original-song-submissions.json');
    extractedApplications.forEach(song => {
        const songForBand = originalSongSubmissions.originalSongs.filter(app => app.bandName === song.bandName);
        const numberOfSongsForBand = songForBand.length;

        if(numberOfSongsForBand === 0){
            song.scheduledWeek = 6;
            song.scheduledWeeks = [6];
            originalSongSubmissions.originalSongs.push(song);
        }

        const indexOfCurrentSong = originalSongSubmissions.originalSongs.findIndex(app => app.bandName === song.bandName);
        if(song.scheduledWeeks === undefined){
            originalSongSubmissions.originalSongs[indexOfCurrentSong].scheduledWeeks = [originalSongSubmissions.originalSongs[indexOfCurrentSong].scheduledWeek];

        }
        originalSongSubmissions.originalSongs[indexOfCurrentSong].lyricsUrl = song.lyricsUrl;
        originalSongSubmissions.originalSongs[indexOfCurrentSong].songDescription = formatSongDescription(song.songDescription);
    });

    return {
        originalSongs: originalSongSubmissions.originalSongs
    };
};

module.exports = {
    format: format
};