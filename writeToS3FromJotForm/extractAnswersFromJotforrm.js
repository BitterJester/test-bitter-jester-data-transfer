const extractAnswersFromJotform = (applications, answerQuestionIdMap) => {
    const applicationAnswersBySubmission = applications.map(application => {
        return application.answers;
    });

    const getAnswerByQuestionId = (applicationAnswers, questionIdAsString) => {
        return applicationAnswers[questionIdAsString] ? applicationAnswers[questionIdAsString].answer : '';
    };

    return {
        completedApplications: applicationAnswersBySubmission.map(answersForBand => {
            let parsedApplication = {};

            Object.keys(answerQuestionIdMap).map(field => {
                parsedApplication[field] = getAnswerByQuestionId(answersForBand, answerQuestionIdMap[field])
            });

            return parsedApplication;
        })
    };
}

module.exports = {
    extractAnswersFromJotform: extractAnswersFromJotform
}