const formatForS3 = require('./formatForS3');

describe('FormatForS3', () => {
    const s3Response = [
        {
            answers: [
                {
                    "39": {
                        name: "retypeYour",
                        answer: "bandName"
                    }
                }
            ]
        }
    ];

    const actual = formatForS3.format(s3Response);

    it('should return a name from the response', () => {
        expect(actual.bandName).toEqual('bandName');
    });
});