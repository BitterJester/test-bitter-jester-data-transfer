require('dotenv').config();
const S3Client = require('s3Client').S3Client;

const BUCKET = 'bitter-jester-test';
const FILE_TO_UPDATE = 'original-song-submissions.json';

exports.handler = async function (event) {
    const s3Client = new S3Client();
    const currentSchedule = await s3Client.getObject('bitter-jester-test', FILE_TO_UPDATE);

    const originalSongs = currentSchedule.originalSongs;

    if (currentSchedule && originalSongs) {
        const updatedSongsWithScheduledWeek = originalSongs.map(song => {
            song.scheduledWeek = song.scheduledWeek ? song.scheduledWeek : 1;
            return song;
        });

        const newOriginalSongSubmissions = {
            originalSongs: updatedSongsWithScheduledWeek
        };

        await s3Client.put(
            s3Client.createPutPublicJsonRequest(
                BUCKET,
                FILE_TO_UPDATE,
                JSON.stringify(newOriginalSongSubmissions)
            )
        );
    }

};