const formatForS3 = require('./formatForS3');

describe('FormatForS3', () => {
    const buildAnswers = (bandName, email, firstChoiceDate) => {
        const buildSingleAnswer = (name, answer) => {
            return {
                name: name,
                answer: answer
            };
        };
        return {
            "39": buildSingleAnswer("retypeYour", bandName),
            "289": buildSingleAnswer("retypeYour289", email),
            "77": buildSingleAnswer("selectYour77", firstChoiceDate)
        };
    };

    const s3Response = [
        {
            answers: buildAnswers("bandName", "email", "1stChoiceDate")
        },
        {
            answers: buildAnswers("bandName2", "email2", undefined)
        }
    ];

    const actual = formatForS3.format(s3Response);

    it('should return a name from the response', () => {
        expect(actual[0].bandName).toEqual('bandName');
    });

    it('should return a primary email from the response', () => {
        expect(actual[0].primaryEmailAddress).toEqual('email');
    });

    it('should return a 1st choice date from the response', () => {
        expect(actual[0].firstChoiceFridayNight).toEqual('1stChoiceDate');
    });

    it('should return a primary email for band 2', () => {
        expect(actual[1].bandName).toEqual('bandName2');
    });

    it('should return a primary email for band 2', () => {
        expect(actual[1].primaryEmailAddress).toEqual('email2');
    });

    it('should return an empty string for undefined firstChoiceDate for band 2', () => {
        expect(actual[1].firstChoiceFridayNight).toEqual('');
    });
});