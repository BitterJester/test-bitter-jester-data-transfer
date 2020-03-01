const BAND_NAME_QUESTION_ID = '39';
const PRIMARY_EMAIL_QUESTION_ID = '289';
const FIRST_CHOICE_FRIDAY_NIGHT_QUESTION = '77';

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
            primaryEmailAddress: getAnswerByQuestionId(answersForBand, PRIMARY_EMAIL_QUESTION_ID),
            firstChoiceFridayNight: getAnswerByQuestionId(answersForBand, FIRST_CHOICE_FRIDAY_NIGHT_QUESTION) || ''
        };
    });
}

module.exports = {
    format: format
}