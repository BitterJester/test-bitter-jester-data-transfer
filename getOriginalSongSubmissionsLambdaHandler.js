require('dotenv').config();
const writeToS3FromJotForm = require('./writeToS3FromJotForm/writeToS3FromJotForm');
const formatOriginalSongSubmissions = require('./getOriginalSongSubmissions/formatOriginalSongSubmissions');

const BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID = 201218940610142;
const OUTPUT_FILE_NAME = 'original-song-submissions.json';

exports.handler = async function (event) {
    await writeToS3FromJotForm.getFormSubmissions(
        BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID,
        OUTPUT_FILE_NAME,
        formatOriginalSongSubmissions.format
    );
};