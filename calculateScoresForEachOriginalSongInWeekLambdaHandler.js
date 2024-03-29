const S3Client = require('s3Client').S3Client;
require('dotenv').config();

exports.handler = async function (event) {
    const weekPath = event.Records[0].Sns.Message;
    const weekAsNumber = Number(weekPath.slice(-1));
    console.log('week: ', weekAsNumber);
    const s3Client = new S3Client();

    const overallSongRankings = await s3Client.getObjectsInFolder('bitter-jester-lake', `${weekPath}/overall-song-rankings/`);

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
                const scoreForBand = scoreForEachBand[indexOfPointsToUpdate];
                scoreForBand.places.push(songRankingFromJudge.placement);
                scoreForEachBand[indexOfPointsToUpdate] = {...scoreForBand, totalPoints, songName, bandName};
            } else {
                scoreForEachBand.push({
                    totalPoints: songRankingFromJudge.value,
                    songName,
                    bandName,
                    places: [songRankingFromJudge.placement],
                    week: weekAsNumber
                })
            }
        })
    });

    const judgesWhoHaveNotSubmittedAllRankings = overallSongRankings.filter(ranking => {
        return !ranking.isFinalRanking && ranking.judge;
    })
        .map(ranking => ranking.judge);

    await s3Client.put(s3Client.createPutPublicJsonRequest(
        'bitter-jester-lake',
        `${weekPath}/song-ranking-totals.json`,
        JSON.stringify({
            totalScores: scoreForEachBand,
            totalFinalRankings: finalSongRankings.length,
            allSongsAreSubmitted: finalSongRankings.length === overallSongRankings.length,
            judgesWhoHaveNotSubmittedAllRankings
        })
    ));
    console.log('Done.');
};