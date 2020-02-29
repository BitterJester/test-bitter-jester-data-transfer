import format  from 'formatForS3.js';

describe(() => {
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

    const actual = format(s3Response);

    it('should return a name from the response', () => {
        expect(actual.bandName).toEqual('bandName');
    });
});