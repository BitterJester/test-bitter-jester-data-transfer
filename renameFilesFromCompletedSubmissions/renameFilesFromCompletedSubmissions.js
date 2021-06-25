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
const tmpFilePath = '/tmp/'

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

const getUploadedFile = (fileName, fileType, type, url, title = '') => {
    return {
        fileName,
        fileType,
        type,
        url,
        title
    };
}

async function getFormFiles(formId, competition, shouldDownloadFiles) {
    const ALL_FILES_PATH = `${competition}/application-files/all/`;
    async function downloadFromJotformAndWriteToS3(fullFileNameAfterRename, url, fileType, s3FilePath, contentType) {
        if (shouldDownloadFiles) {
            const temporaryFilePath = `${tmpFilePath}${fullFileNameAfterRename}`;
            await downloadFile(url, temporaryFilePath);
            await s3Client.put(
                s3Client.createPutPublicJsonRequest(
                    'bitter-jester-test',
                    s3FilePath,
                    fs.readFileSync(temporaryFilePath),
                    contentType
                )
            );
            await s3Client.put(
                s3Client.createPutPublicJsonRequest(
                    'bitter-jester-test',
                    `${ALL_FILES_PATH}${fullFileNameAfterRename}`,
                    fs.readFileSync(temporaryFilePath),
                    contentType
                )
            );
            fs.unlinkSync(temporaryFilePath);
        }
    }

    await jotform.getFormSubmissions(formId)
        .then(async function (applications) {
            const jotformAnswerMap = {
                bandLogoUrls: '254',
                bandPhotosUrls: '253',
                musicSamplesUrls: '252',
                musicSampleUrls2: '543',
                stagePlotUrls: '264',
                musicSampleTitle1: '544',
                musicSampleTitle2: '546',
                bandName: '39',
            };

            const uploadedFiles = extractAnswersFromJotform.extractAnswersFromJotform(applications, jotformAnswerMap);
            console.error(uploadedFiles);
            const allFiles = [];
            for (let app of uploadedFiles) {
                const fileNameFormattedBandName = app.bandName.trim().replace(/[^\w\s&]/gi, '').split(' ').join('-');
                const filePathForBand = `${competition}/application-files/bandName=${fileNameFormattedBandName}/`;
                for (let index = 0; index < app.bandLogoUrls.length; index++) {
                    try {
                        const bandLogoUrl = app.bandLogoUrls[index];
                        const fileType = getFileType(bandLogoUrl);
                        const fullFileNameAfterRename = `${fileNameFormattedBandName}_Logo-${index + 1}.${fileType}`;
                        const s3FilePath = `${competition}/application-files/bandName=${fileNameFormattedBandName}/${fullFileNameAfterRename}`;
                        const contentType = fileType === 'jpeg' ? 'image/jpeg' : 'image/png';
                        await downloadFromJotformAndWriteToS3(fullFileNameAfterRename, bandLogoUrl, fileType, s3FilePath, contentType);
                        allFiles.push(getUploadedFile(fullFileNameAfterRename, fileType, 'logo', bandLogoUrl));
                        console.log(`done with logo ${s3FilePath}`)
                    } catch (e) {
                        console.error('Error with logo: ', e);
                    }
                }

                for (let index = 0; index < app.bandPhotosUrls.length; index++) {
                    try {
                        const bandPhotoUrl = app.bandPhotosUrls[index];
                        const fileType = getFileType(bandPhotoUrl);
                        const fileName = `${fileNameFormattedBandName}_Photo-${index + 1}.${fileType}`;
                        const s3FilePath = `${filePathForBand}${fileName}`;
                        await downloadFromJotformAndWriteToS3(fileName, bandPhotoUrl, s3FilePath, `image/${fileType}`);
                        allFiles.push(getUploadedFile(fileName, fileType, 'band_photo', bandPhotoUrl));
                        console.log(`done with photo ${s3FilePath}`);
                    } catch (e) {
                        console.error('Error with photo: ', e);
                    }
                }
                const allMusicSampleUrlsForApp = app.musicSampleUrls2 ? [...app.musicSamplesUrls, ...app.musicSampleUrls2] : app.musicSamplesUrls;
                for (let index = 0; index < allMusicSampleUrlsForApp.length; index++) {
                    try {
                        const musicSamplesUrl = allMusicSampleUrlsForApp[index];
                        const fileType = getFileType(musicSamplesUrl);
                        const songName = index === 0 ? app.musicSampleTitle1 : app.musicSampleTitle2;
                        const formattedSongName = songName ? songName.trim().replace(/[^\w\s&]/gi, '').split(' ').join('-') : 'NO-NAME';
                        const fileName = `${fileNameFormattedBandName}_Music-${index + 1}_${formattedSongName}.${fileType}`;
                        const s3FilePath = `${filePathForBand}${fileName}`;
                        const contentType = fileType === 'mp3' ? 'audio/mpeg' : `audio/${fileType}`;
                        await downloadFromJotformAndWriteToS3(fileName, musicSamplesUrl, fileType, s3FilePath, contentType)
                        allFiles.push(getUploadedFile(fileName, fileType, 'music', musicSamplesUrl, songName));
                        console.log(`done with song ${s3FilePath}`)
                    } catch (e) {
                        console.error('Error with song: ', e);
                    }
                }

                for (let index = 0; index < app.stagePlotUrls.length; index++) {
                    try {
                        const stagePlotUrl = app.stagePlotUrls[index];
                        const fileType = getFileType(stagePlotUrl);
                        const fileName = `${fileNameFormattedBandName}_Stage-Plot-${index + 1}.${fileType}`;
                        const s3FilePath = `${filePathForBand}${fileName}`;
                        await downloadFromJotformAndWriteToS3(fileName, fileType, stagePlotUrl, s3FilePath, `image/${fileType}`);
                        allFiles.push(getUploadedFile(fileName, fileType, 'stage_plot', stagePlotUrl));
                        console.log(`done with stage plot ${s3FilePath}`)
                    } catch (e) {
                        console.error('Error with stage plot: ', e);
                    }
                }
                await s3Client.put(s3Client.createPutPublicJsonRequest(
                    'bitter-jester-test',
                    `${competition}/uploaded-files.json`,
                    JSON.stringify({files: allFiles}),
                ));
            }
        })
        .fail(function (error) {
            console.log(`Error: ${error}`);
        });
}

module.exports = {
    getFormFiles: getFormFiles
};