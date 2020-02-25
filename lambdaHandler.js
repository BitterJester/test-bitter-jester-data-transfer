const writeToS3FromJotForm = require('./writeToS3FromJotForm');

exports.handler = async function(event) {
    await writeToS3FromJotForm.getFormSubmissions();
}