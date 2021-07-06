require('dotenv').config();
const writeToS3FromJotForm = require('./writeToS3FromJotForm/writeToS3FromJotForm');
const format = require('./jotform-formatters/judges-schedule-formatter');

const BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID = 211478218583158;
const OUTPUT_FILE_NAME = 'judges-applications.json';

exports.handler = async function (event) {
    try {
        const competition = event.competitionId ? `competition=${event.competitionId}` : event.Records[0].Sns.Message;
        const submissions = await writeToS3FromJotForm.getFormSubmissions(
            BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID,
            `${competition}/${OUTPUT_FILE_NAME}`,
            format.format
        );

        return {responseCode: 200, body: submissions};
    } catch (e) {
        return e;
    }
};