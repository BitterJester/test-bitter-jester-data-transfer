require('dotenv').config();
const writeToS3FromJotForm = require('./writeToS3FromJotForm/writeToS3FromJotForm');
const SNSClient = require('./snsClient').SNSClient;
const formatForS3 = require('./completedApplications/formatForS3');

const BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID = 211443460736149;
const OUTPUT_FILE_NAME = 'completed-submissions.json';

const snsClient = new SNSClient();

exports.handler = async function (event) {
    try {
        const competition = event.competitionId? `competition=${event.competitionId}` : event.Records[0].Sns.Message;
        const submissions = await writeToS3FromJotForm.getFormSubmissions(
            BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID,
            `${competition}/${OUTPUT_FILE_NAME}`,
            formatForS3.format
        );

        const snsMessage = {
            TopicArn: 'arn:aws:sns:us-east-1:771384749710:BandApplicationUpdatedSnsTopic',
            Message: competition
        };

        await snsClient.publishSNSMessage(snsMessage);
        return {responseCode: 200, body: submissions};
    } catch (e) {
        return e;
    }
};