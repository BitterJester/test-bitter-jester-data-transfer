const S3Client = require('s3Client').S3Client;
require('dotenv').config();

exports.handler = async function (event) {
    const s3Client = new S3Client();

    const judgesComments = await s3Client.getObjectsInFolder('bitter-jester-test', 'judges-comments/');

    const allJudges = await s3Client.getObjectsInFolder('bitter-jester-test', 'judges-info.json');
    const listOfJudges = allJudges[0].judges;
    const judgesForWeek = listOfJudges.filter(judge => judge.week === 1);
    const judgesWhoHaveNotSubmittedAllComments = [];

    judgesForWeek.forEach(judge => {
        const commentsForJudge = judgesComments.filter(comment => comment.judge.email === judge.emailAddress);

        const numberOfSongsWithAllComments = commentsForJudge.filter(comment => {
            return comment.initialImpression !== '' && comment.feedback !== '' && comment.favoriteAspect !== '';
        }).length;
        const allCommentsAreFilledIn = numberOfSongsWithAllComments === 14;

        if(!allCommentsAreFilledIn){
            judgesWhoHaveNotSubmittedAllComments.push({judge: judge, numberOfSongsWithAllComments});
        }
    });

    const allCommentsAreSubmitted = judgesComments.length ===  judgesForWeek.length*3*14;
    await s3Client.put(s3Client.createPutPublicJsonRequest(
        'bitter-jester-test',
        'aggregated-judges-comments.json',
        JSON.stringify({comments: judgesComments, allCommentsAreSubmitted, judgesWhoHaveNotSubmittedAllComments, numberOfJudgesWhoHaveNotSubmittedAllComments: judgesWhoHaveNotSubmittedAllComments.length})
    ));
    console.log('Done.');
};