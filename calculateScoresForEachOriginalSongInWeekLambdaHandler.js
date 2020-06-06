const S3Client = require('s3Client').S3Client;
require('dotenv').config();

exports.handler = async function (event) {
    const s3Client = new S3Client();

    const overallSongRankings = await s3Client.getObjectsInFolder('bitter-jester-test', 'overall-song-rankings/');

    const finalSongRankings = overallSongRankings.filter(ranking => ranking.isFinalRanking);

    const scoreForEachBand = [];
    finalSongRankings.forEach(judge => {
        judge.rankings.forEach(songRankingFromJudge => {
            const songName = songRankingFromJudge.songName;
            const bandName = songRankingFromJudge.bandName;

            const totalScoreForSong = scoreForEachBand.filter(score => score.songName === songName)[0];
            if (totalScoreForSong) {
                const totalPoints = totalScoreForSong.totalPoints + songRankingFromJudge.value;
                const indexOfPointsToUpdate = scoreForEachBand.findIndex(score => {
                    return score.songName === songName;
                });
                scoreForEachBand[indexOfPointsToUpdate] = {totalPoints, songName, bandName};
            } else {
                scoreForEachBand.push({totalPoints: songRankingFromJudge.value, songName, bandName})
            }
        })
    });

    await s3Client.put(s3Client.createPutPublicJsonRequest(
        'bitter-jester-test',
        'song-ranking-totals.json',
        JSON.stringify({totalScores: scoreForEachBand, totalFinalRankings: finalSongRankings.length, allSongsAreSubmitted: finalSongRankings.length === overallSongRankings.length})
    ));
    console.log('Done.');
};