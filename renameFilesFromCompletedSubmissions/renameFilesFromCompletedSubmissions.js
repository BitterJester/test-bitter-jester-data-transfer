require('dotenv').config();
const jotform = require('jotform');
const S3Client = require('../s3Client').S3Client;
const extractAnswersFromJotform = require('../writeToS3FromJotForm/extractAnswersFromJotforrm');
const axios = require("axios");
const https = require('https');
const fs = require('fs');
const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY;
const s3Bucket = 'bitter-jester-test';

const s3Client = new S3Client();

jotform.options({
    debug: true,
    apiKey: JOTFORM_API_KEY,
    timeout: 10000
});

async function getFormFiles(formId, competition) {
    await jotform.getFormSubmissions(formId)
        .then(async function (applications) {
            // 254 = band logo, 253 = band photos, 252 music samples,
            // Band Name_Music 01_Song Name.xyz
            // Band Name_Music 02_Song Name.xyz*
            //
            // Band Name_Photo 01.xyz
            // Band Name_Photo 02.xyz*
            const jotformAnswerMap = {
                bandLogoUrls: '254',
                bandPhotosUrls: '253',
                musicSamplesUrls: '252',
                bandName: '39',
            };

            const extractedApplications = extractAnswersFromJotform.extractAnswersFromJotform(applications, jotformAnswerMap);
            console.error(extractedApplications);
            for (let app of extractedApplications) {
                for (let index = 0; index < app.bandLogoUrls.length; index++) {
                    const bandLogoUrl = app.bandLogoUrls[index];
                    const urlParts = bandLogoUrl.split('.');
                    const fileNameFormattedBandName = app.bandName.split(' ').join('-');
                    const fileType = urlParts[urlParts.length - 1];
                    const fullFileNameAfterRename = `${fileNameFormattedBandName}_Logo-${index + 1}.${fileType}`;
                    const temporaryFilePath = `/tmp/${fullFileNameAfterRename}`;
                    const response = await axios.get(bandLogoUrl);
                    const s3FilePath = `${competition}/applicationFiles/bandName=${fileNameFormattedBandName}/${fullFileNameAfterRename}`;
                    console.error(response);
                    await s3Client.put(
                        s3Client.createPutPublicJsonRequest(
                            'bitter-jester-test',
                            s3FilePath,
                            response.data
                        )
                    )
                    console.log(`done with ${s3FilePath}`)
                    // console.error(fs.readdirSync('/tmp/'));
                }
            }
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