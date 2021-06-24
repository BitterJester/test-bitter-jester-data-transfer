require('dotenv').config();
const jotform = require('jotform');
const archiver = require('archiver');
const S3Client = require('../s3Client').S3Client;
const extractAnswersFromJotform = require('../writeToS3FromJotForm/extractAnswersFromJotforrm');
const axios = require("axios");
const fs = require('fs');
const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY;
const stream = require('stream');
const util = require('util');
const s3Client = new S3Client();
const tmpFilePath = '/tmp/files/'

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

function zipDirectory(source, out, fileName) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
        archive
            .directory(source, '/', {name: fileName})
            .on('error', err => reject(err))
            .pipe(stream);

        stream.on('close', () => resolve());
        archive.finalize();
    });
}

function getFileType(url) {
    const urlParts = url.split('.');
    return urlParts[urlParts.length - 1];
}

async function getFormFiles(formId, competition) {
    await jotform.getFormSubmissions(formId)
        .then(async function (applications) {
            const jotformAnswerMap = {
                bandLogoUrls: '254',
                bandPhotosUrls: '253',
                musicSamplesUrls: '252',
                bandName: '39',
            };

            const extractedApplications = extractAnswersFromJotform.extractAnswersFromJotform(applications, jotformAnswerMap);
            console.error(extractedApplications);
            for (let app of extractedApplications) {
                const fileNameFormattedBandName = app.bandName.trim().split(' ').join('-');
                const filePathForBand = `${competition}/application-files/bandName=${fileNameFormattedBandName}/`;
                for (let index = 0; index < app.bandLogoUrls.length; index++) {
                    const bandLogoUrl = app.bandLogoUrls[index];
                    const fileType = getFileType(bandLogoUrl);
                    const fullFileNameAfterRename = `${fileNameFormattedBandName}_Logo-${index + 1}.${fileType}`;
                    const temporaryFilePath = `${tmpFilePath}${fullFileNameAfterRename}`;
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

                for(let index = 0; index < app.bandPhotosUrls.length; index++){
                    const bandPhotoUrl = app.bandPhotosUrls[index];
                    const fileType = getFileType(bandPhotoUrl);
                    const fileName = `${fileNameFormattedBandName}_Photo-${index + 1}.${fileType}`;
                    const temporaryFilePath = `${tmpFilePath}${fileName}`;
                    await downloadFile(bandPhotoUrl, temporaryFilePath);
                    const s3FilePath = `${filePathForBand}${fileName}`;
                    const contentType = `image/${fileType}`;
                    await s3Client.put(
                        s3Client.createPutPublicJsonRequest(
                            'bitter-jester-test',
                            s3FilePath,
                            fs.readFileSync(temporaryFilePath),
                            contentType
                        )
                    )
                    console.log(`done with song ${s3FilePath}`)
                }

                for(let index = 0; index < app.musicSamplesUrls.length; index++){
                    const musicSamplesUrl = app.musicSamplesUrls[index];
                    const fileType = getFileType(musicSamplesUrl);
                    const fileName = `${fileNameFormattedBandName}_Music-${index + 1}.${fileType}`;
                    const temporaryFilePath = `${tmpFilePath}${fileName}`;
                    await downloadFile(musicSamplesUrl, temporaryFilePath);
                    const s3FilePath = `${filePathForBand}${fileName}`;
                    const contentType = fileType === 'mp3' ? 'audio/mpeg' : `audio/${fileType}`;
                    await s3Client.put(
                        s3Client.createPutPublicJsonRequest(
                            'bitter-jester-test',
                            s3FilePath,
                            fs.readFileSync(temporaryFilePath),
                            contentType
                        )
                    )
                    console.log(`done with song ${s3FilePath}`)
                }
            }
            await zipDirectory(tmpFilePath, `/tmp/packaged.zip`);
            await s3Client.put(
                s3Client.createPutPublicJsonRequest(
                    'bitter-jester-test',
                    `${competition}/application-files/packaged.zip`,
                    fs.readFileSync('/tmp/application-files.zip')
                )
            )
        })
        .fail(function (error) {
            console.log(`Error: ${error}`);
        });
}

module.exports = {
    getFormFiles: getFormFiles
};