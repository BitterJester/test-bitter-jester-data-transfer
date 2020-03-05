const BAND_NAME_QUESTION_ID = '39';
const PRIMARY_EMAIL_QUESTION_ID = '289';
const FIRST_CHOICE_FRIDAY_NIGHT_QUESTION_ID = '77';
const SECOND_CHOICE_FRIDAY_NIGHT_QUESTION_ID = '78';
const IS_BAND_AVAILABLE_ON_ALL_FRIDAYS_QUESTION_ID = '232';

const format = (s3Response) => {
    const applicationAnswersBySubmission = s3Response.map(application => {
        return application.answers;
    });

    const getAnswerByQuestionId = (applicationAnswers, questionIdAsString) => {
        return applicationAnswers[questionIdAsString].answer;
    };

    const isBandAvailableOnAllFridays = (isBandAvailableStringField) => {
        return !isBandAvailableStringField.toLowerCase().includes('not available');
    }

    return {
        completedApplications: applicationAnswersBySubmission.map(answersForBand => {
            return {
                bandName: getAnswerByQuestionId(answersForBand, BAND_NAME_QUESTION_ID),
                primaryEmailAddress: getAnswerByQuestionId(answersForBand, PRIMARY_EMAIL_QUESTION_ID),
                firstChoiceFridayNight: getAnswerByQuestionId(answersForBand, FIRST_CHOICE_FRIDAY_NIGHT_QUESTION_ID) || 'Available Every Friday',
                secondChoiceFridayNight: getAnswerByQuestionId(answersForBand, SECOND_CHOICE_FRIDAY_NIGHT_QUESTION_ID) || '',
                isBandAvailableOnAllFridays: isBandAvailableOnAllFridays(getAnswerByQuestionId(answersForBand, IS_BAND_AVAILABLE_ON_ALL_FRIDAYS_QUESTION_ID))
            }
        })
    };
}

module.exports = {
    format: format
}