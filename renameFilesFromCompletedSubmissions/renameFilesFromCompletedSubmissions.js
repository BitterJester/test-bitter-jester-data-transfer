require('dotenv').config();
const jotform = require('jotform');
const S3Client = require('../s3Client').S3Client;

const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY;
const s3Bucket = 'bitter-jester-test';

const s3Client = new S3Client();

jotform.options({
    debug: true,
    apiKey: JOTFORM_API_KEY,
    timeout: 10000
});
// {
//     "responseCode": 200,
//     "message": "success",
//     "content": [
//     {
//         "name": "picture.png",
//         "type": "image/png",
//         "size": "9692",
//         "username": "johnsmith",
//         "form_id": "31754366679872",
//         "submission_id": "237977932346236318",
//         "date": "2013-06-25 09:58:52",
//         "url": "http://www.jotform.com/uploads/johnsmith/31754366679872/237977932346236318/screen.png",
//     }
// ],
//     "limit-left": 9962
// }
async function getFormFiles(formId) {
    await jotform.getFormFiles(formId)
        .then(async function (response) {
            console.error(response);

            // const s3PutRequest = s3Client.createPutPublicJsonRequest(
            //     s3Bucket,
            //     filename,
            //     JSON.stringify(formattedResponse)
            // );
            // await s3Client.put(s3PutRequest);
        })
        .fail(function (error) {
            console.log(`Error: ${error}`);
        });
}

module.exports = {
    getFormFiles: getFormFiles
};