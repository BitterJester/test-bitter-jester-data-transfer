require('dotenv').config();
const jotform = require('jotform');
const S3Client = require('../s3Client').S3Client;

const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY;
const AWS_ACCESS_ID = process.env.AWS_ACCESS_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const s3Bucket = 'bitter-jester-test';

const s3Client = new S3Client(AWS_ACCESS_ID, AWS_SECRET_KEY);

jotform.options({
    debug: true,
    apiKey: JOTFORM_API_KEY,
    timeout: 10000
});

async function getFormSubmissions(formId, filename, formatFunction) {
    await jotform.getFormSubmissions(formId)
        .then(async function(response) {
            const formattedResponse = formatFunction(response);
            const s3PutRequest = s3Client.createPutPublicJsonRequest(
                s3Bucket,
                filename,
                JSON.stringify(formattedResponse)
            );
            await s3Client.put(s3PutRequest);
        })
        .fail(function(error) {
            console.log(`Error: ${error}`);
        });
}

module.exports = {
    getFormSubmissions: getFormSubmissions
};