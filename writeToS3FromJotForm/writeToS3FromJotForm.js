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

async function getFormSubmissions(formId, filename, formatFunction) {
    const queryParams = {
        limit: 1000
    }
    return jotform.getFormSubmissions(formId, queryParams)
        .then(async function (response) {
            const formattedResponse = await formatFunction(response, formId);
            const s3PutRequest = s3Client.createPutPublicJsonRequest(
                s3Bucket,
                filename,
                JSON.stringify(formattedResponse)
            );
            await s3Client.put(s3PutRequest);
            return formattedResponse;
        })
        .fail(function (error) {
            console.log(`Error: ${error}`);
        });
}

module.exports = {
    getFormSubmissions: getFormSubmissions
};