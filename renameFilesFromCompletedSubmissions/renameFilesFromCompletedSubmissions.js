require('dotenv').config();
const jotform = require('jotform');
const S3Client = require('../s3Client').S3Client;
const extractAnswersFromJotform = require('../writeToS3FromJotForm/extractAnswersFromJotforrm');

const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY;
const s3Bucket = 'bitter-jester-test';

const s3Client = new S3Client();

jotform.options({
    debug: true,
    apiKey: JOTFORM_API_KEY,
    timeout: 10000
});

async function getFormFiles(formId) {
    await jotform.getFormSubmissions(formId)
        .then(async function (applications) {
            // 254 = band logo, 253 = band photos, 252 music samples,

            const jotformAnswerMap = {
                bandLogoUrls: '254',
                bandPhotosUrls: '253',
                musicSamplesUrls: '252',
                bandName: '39',
            };

            const extractedApplications = extractAnswersFromJotform.extractAnswersFromJotform(applications, jotformAnswerMap);
            console.error(extractedApplications);
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