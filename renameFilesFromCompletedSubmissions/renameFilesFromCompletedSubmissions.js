require('dotenv').config();
const jotform = require('jotform');
const S3Client = require('../s3Client').S3Client;
const extractAnswersFromJotform = require('../writeToS3FromJotForm/extractAnswersFromJotforrm');
const axios = require("axios");
const fs = require('fs');
const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY;
const stream = require('stream');
const util = require('util');
const s3Client = new S3Client();

jotform.options({
    debug: true,
    apiKey: JOTFORM_API_KEY,
    timeout: 10000
});

const finished = util.promisify(stream.finished);

async function downloadFile(fileUrl, outputLocationPath) {
    const writer = fs.createWriteStream(outputLocationPath);
    return axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(async response => {
        response.data.pipe(writer);
        return finished(writer);
    });
}

function getFileType(url) {
    const urlParts = url.split('.');
    return urlParts[urlParts.length - 1];
}

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
                const fileNameFormattedBandName = app.bandName.split(' ').join('-');

                for (let index = 0; index < app.bandLogoUrls.length; index++) {
                    const bandLogoUrl = app.bandLogoUrls[index];
                    const fileType = getFileType(bandLogoUrl);
                    const fullFileNameAfterRename = `${fileNameFormattedBandName}_Logo-${index + 1}.${fileType}`;
                    const temporaryFilePath = `/tmp/${fullFileNameAfterRename}`;
                    await downloadFile(bandLogoUrl, temporaryFilePath);
                    const s3FilePath = `${competition}/application-files/bandName=${fileNameFormattedBandName}/${fullFileNameAfterRename}`;
                    const contentType = fileType === 'jpeg' ? 'image/jpeg' : 'image/png';
                    await s3Client.put(
                        s3Client.createPutPublicJsonRequest(
                            'bitter-jester-test',
                            s3FilePath,
                            fs.readFileSync(temporaryFilePath),
                            contentType
                        )
                    )
                    console.log(`done with logo ${s3FilePath}`)
                }
                // Band Name_Music 01_Song Name.xyz
                for(let index = 0; index < app.musicSamplesUrls.length; index++){
                    const musicSamplesUrl = app.musicSamplesUrls[index];
                    const fileType = getFileType(musicSamplesUrl);
                    const fileName = `${fileNameFormattedBandName}_Music-${index + 1}.${fileType}`;
                    const temporaryFilePath = `/tmp/${fileName}`;
                    await downloadFile(musicSamplesUrl, temporaryFilePath);
                    const s3FilePath = `${competition}/application-files/bandName=${fileNameFormattedBandName}/${fileName}`;
                    const contentType = fileType === 'mp3' ? 'audio/mpeg' : `audio/${fileType}`;
                    await s3Client.put(
                        s3Client.createPutPublicJsonRequest(
                            'bitter-jester-test',
                            s3FilePath,
                            fs.readFileSync(temporaryFilePath),
                            contentType
                        )
                    )
                    fs.rmSync(temporaryFilePath);
                    console.log(`done with song ${s3FilePath}`)
                }
            }
        })
        .fail(function (error) {
            console.log(`Error: ${error}`);
        });
}

module.exports = {
    getFormFiles: getFormFiles
};