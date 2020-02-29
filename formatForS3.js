const format = (s3Response) => {
    const getAnswerByQuestionId = (questionIdAsString) => {
        return s3Response[0].answers[questionIdAsString].answer;
    };

    return {
        bandName: getAnswerByQuestionId('39'),
        primaryEmailAddress: getAnswerByQuestionId('289')
    };
}

module.exports = {
    format: format
}