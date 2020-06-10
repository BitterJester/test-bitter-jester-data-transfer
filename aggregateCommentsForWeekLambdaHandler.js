const S3Client = require('s3Client').S3Client;
require('dotenv').config();

exports.handler = async function (event) {
    const weekPath = 'week=1';
    const weekAsNumber = 1;
    console.log('week: ', weekAsNumber);
    const s3Client = new S3Client();

    const judgesComments = await s3Client.getObjectsInFolder('bitter-jester-test', 'judges-comments/');

    const allJudges = await s3Client.getObjectsInFolder('bitter-jester-test', 'judges-info.json');
    const listOfJudges = allJudges[0].judges;
    const judgesForWeek = listOfJudges.filter(judge => judge.week === weekAsNumber);

    const judgesWhoHaveNotSubmittedAllComments = [];
    const addJudgeIfNotSubmittedAllComments = (commentsForJudge) => {
        const numberOfSongsWithAllComments = commentsForJudge.filter(comment => {
            return comment.initialImpression !== '' && comment.feedback !== '' && comment.favoriteAspect !== '';
        }).length;
        const allCommentsAreFilledIn = numberOfSongsWithAllComments === 14;
        if(!allCommentsAreFilledIn){
            judgesWhoHaveNotSubmittedAllComments.push({judge: judge, numberOfSongsWithAllComments});
        }
    };

    let judgesCommentsForWeek = [];
    const addJudgesCommentsForWeek = (commentsForJudge) => {
        judgesCommentsForWeek = judgesCommentsForWeek.concat(commentsForJudge);
    };

    const aggregate = (judge) => {
        const commentsForJudge = judgesComments.filter(comment => comment.judge.email === judge.emailAddress);
        addJudgesCommentsForWeek(commentsForJudge);
        addJudgeIfNotSubmittedAllComments(commentsForJudge)
    };

    judgesForWeek.forEach(judge => {
        aggregate(judge);
    });

    const allCommentsAreSubmitted = judgesComments.length ===  judgesForWeek.length*3*14;
    await s3Client.put(s3Client.createPutPublicJsonRequest(
        'bitter-jester-test',
        `${weekPath}/aggregated-judges-comments.json`,
        JSON.stringify({comments: judgesCommentsForWeek, allCommentsAreSubmitted, judgesWhoHaveNotSubmittedAllComments, numberOfJudgesWhoHaveNotSubmittedAllComments: judgesWhoHaveNotSubmittedAllComments.length})
    ));
    console.log('Done.');
}