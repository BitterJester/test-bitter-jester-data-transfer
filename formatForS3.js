const format = (s3Response) => {
    const applicationAnswersBySubmission = s3Response.map(application => {
        return application.answers;
    });

    const getAnswerByQuestionId = (applicationAnswers, questionIdAsString) => {
        return applicationAnswers[questionIdAsString].answer;
    };

    return applicationAnswersBySubmission.map(answersForBand => {
        return {
            bandName: getAnswerByQuestionId(answersForBand, '39'),
            primaryEmailAddress: getAnswerByQuestionId(answersForBand, '289')
        };
    });
}

module.exports = {
    format: format
}