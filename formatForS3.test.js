const formatForS3 = require('./formatForS3');

describe('FormatForS3', () => {
    const s3Response = [
        {
            answers:  {
                "39": {
                    name: "retypeYour",
                    answer: "bandName"
                },
                "289": {
                    name: "retypeYour289",
                    answer: "primaryEmailAddress"
                }
            }
        }
    ];

    const actual = formatForS3.format(s3Response);

    it('should return a name from the response', () => {
        expect(actual.bandName).toEqual('bandName');
    });

    it('should return a primary email from the response', () => {
        expect(actual.primaryEmailAddress).toEqual('primaryEmailAddress');
    });
});