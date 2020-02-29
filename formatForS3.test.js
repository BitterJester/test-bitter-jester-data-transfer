const formatForS3 = require('./formatForS3');

describe('FormatForS3', () => {
    const buildAnswer = (bandName, email) => {
        return {
            "39": {
                name: "retypeYour",
                answer: bandName
            },
            "289": {
                name: "retypeYour289",
                answer: email
            }
        };
    }

    const buildS3Response = (bandName, email) => {
        return {
            answers: buildAnswer(bandName, email)
        };
    };

    const s3Response = [
        buildS3Response("bandName", "email"),
        buildS3Response("bandName2", "email2")
    ];

    const actual = formatForS3.format(s3Response);

    it('should return a name from the response', () => {
        expect(actual[0].bandName).toEqual('bandName');
    });

    it('should return a primary email from the response', () => {
        expect(actual[0].primaryEmailAddress).toEqual('email');
    });

    it('should return a primary email for band 2', () => {
        expect(actual[1].bandName).toEqual('bandName2');
    });

    it('should return a primary email for band 2', () => {
        expect(actual[1].primaryEmailAddress).toEqual('email2');
    });
});