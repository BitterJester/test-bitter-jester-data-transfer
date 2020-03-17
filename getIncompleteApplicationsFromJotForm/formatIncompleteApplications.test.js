const formatIncompleteApplications = require('./formatIncompleteApplications');

describe('Incomplete Applications For S3', () => {
    const buildAnswers = (bandName, applicantName, primaryEmailAddress, relationshipToBand) => {
        const buildSingleAnswer = (answer) => {
            return {
                answer: answer
            };
        };
        return {
            "3": buildSingleAnswer(applicantName),
            "39": buildSingleAnswer(bandName),
            "40": buildSingleAnswer(primaryEmailAddress),
            "44": buildSingleAnswer(relationshipToBand)
        };
    };

    const jotformResponse = [
        {
            answers: buildAnswers("bandName", {name: "name1"}, "email", "relationship")
        },
        {
            answers: buildAnswers("bandName2", {name: "name2"}, undefined, undefined)
        }
    ];

    const actual = formatIncompleteApplications.format(jotformResponse).incompleteApplications;
    console.log(actual);
    describe('band 1', () => {
        it('should return an applicant name from the response', () => {
            expect(actual[0].applicantName.name).toEqual('name1');
        });

        it('should return a band name from the response', () => {
            expect(actual[0].bandName).toEqual('bandName');
        });

        it('should return a primary email address from the response', () => {
            expect(actual[0].primaryEmailAddress).toEqual('email');
        });

        it('should return a relationship to band from the response', () => {
            expect(actual[0].relationshipToBand).toEqual('relationship');
        });
    });

    describe('band 2', () => {
        it('should return a applicant name for band 2', () => {
            expect(actual[1].applicantName.name).toEqual('name2');
        });

        it('should return a band name for band 2', () => {
            expect(actual[1].bandName).toEqual('bandName2');
        });

        it('should return an empty string for undefined email for band 2', () => {
            expect(actual[1].primaryEmailAddress).toEqual('');
        });

        it('should return an empty string for undefined relationship for band 2', () => {
            expect(actual[1].relationshipToBand).toEqual('');
        });
    });
});