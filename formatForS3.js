const BAND_NAME_QUESTION_ID = '39';
const PRIMARY_EMAIL_QUESTION_ID = '289';

const format = (s3Response) => {
    const applicationAnswersBySubmission = s3Response.map(application => {
        return application.answers;
    });

    const getAnswerByQuestionId = (applicationAnswers, questionIdAsString) => {
        return applicationAnswers[questionIdAsString].answer;
    };

    return applicationAnswersBySubmission.map(answersForBand => {
        return {
            bandName: getAnswerByQuestionId(answersForBand, BAND_NAME_QUESTION_ID),
            primaryEmailAddress: getAnswerByQuestionId(answersForBand, PRIMARY_EMAIL_QUESTION_ID)
        };
    });
}

module.exports = {
    format: format
}