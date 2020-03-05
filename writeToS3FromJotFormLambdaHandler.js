require('dotenv').config();
const writeToS3FromJotForm = require('./writeToS3FromJotForm/writeToS3FromJotForm');

exports.handler = async function(event) {
    await writeToS3FromJotForm.getFormSubmissions();
}