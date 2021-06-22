const extractAnswersFromJotform = (applications, answerQuestionIdMap) => {
    const applicationAnswersBySubmission = applications
        .filter(application => application.status === 'ACTIVE')
        .map(application => {
        return application.answers;
    });

    const getAnswerByQuestionId = (applicationAnswers, questionIdAsString) => {
        return applicationAnswers[questionIdAsString] ? applicationAnswers[questionIdAsString].answer : '';
    };

    return applicationAnswersBySubmission.map(answersForBand => {
            let parsedApplication = {};

            Object.keys(answerQuestionIdMap).map(field => {
                parsedApplication[field] = getAnswerByQuestionId(answersForBand, answerQuestionIdMap[field])
            });

            return parsedApplication;
        });
}

module.exports = {
    extractAnswersFromJotform: extractAnswersFromJotform
}