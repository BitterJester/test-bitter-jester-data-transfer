require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');
const jotform = require('jotform');
const formatForS3 = require('formatForS3');

const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY;
const AWS_ACCESS_ID = process.env.AWS_ACCESS_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

const BITTER_JESTER_TEST_FORM_ID = 193466400251149;
const s3Bucket = 'bitter-jester-test';

class S3Client {
    constructor(
        accessKeyId,
        secretAccessKey
    ) {
        this.client = new AWS.S3({
            accessKeyId,
            secretAccessKey
        })
    }

    async put(request) {
        return new Promise((resolve, reject) => {
            this.client.putObject(request, (error, data) => {
                if (error) {
                    return reject(error);
                }

                return resolve(data);
            })
        })
    }

    createPutPublicJsonRequest(
        location,
        filename,
        contents
    ) {
        return {
            Bucket: location,
            Key: filename,
            Body: contents,
            ContentType: 'application/json; charset=utf-8',
            ACL: 'public-read',
            CacheControl: 'max-age=60'
        };
    }
}

const s3Client = new S3Client(AWS_ACCESS_ID, AWS_SECRET_KEY);

jotform.options({
    debug: true,
    apiKey: JOTFORM_API_KEY,
    timeout: 10000
});

async function getFormSubmissions() {
    await jotform.getFormSubmissions(BITTER_JESTER_TEST_FORM_ID)
        .then(async function(response) {
            const formattedResponse = formatForS3.format(response);
            const s3PutRequest = s3Client.createPutPublicJsonRequest(
                s3Bucket,
                'bitter-jester-test.json',
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
}