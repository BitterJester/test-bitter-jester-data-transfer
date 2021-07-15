require('dotenv').config();
const S3Client = require("./s3Client").S3Client;
const s3Client = new S3Client();

const writeToS3FromJotForm = require('./writeToS3FromJotForm/writeToS3FromJotForm');
const formatForS3 = require('./completedApplications/formatForS3');
const BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID = 211443460736149;
const OUTPUT_FILE_NAME = 'completed-submissions.json';

exports.handler = async function (event) {
    try{
        let competition;
        if(event.competitionId){
            competition = `competition=${event.competitionId}`;
        } else {
            competition = event.Records[0].Sns.Message;
        }
        const submissions = await writeToS3FromJotForm.getFormSubmissions(
            BITTER_JESTER_COMPLETED_APPLICATIONS_JOTFORM_FORM_ID,
            `${competition}/${OUTPUT_FILE_NAME}`,
            formatForS3.format,
            s3Client
        );
        const schedule = await s3Client
            .getObject('bitter-jester-test', `${competition}/user-friday-night-schedule.json`);
        console.error(schedule);
        const updatedNights = [];
        for(let night of schedule.nights){
            const updatedBandsForNight = night.bands.map(band => submissions.completedApplications.find(sub => sub.bandName === band.bandName));
            updatedNights.push({...night, bands: updatedBandsForNight});
        }
        const updatedSchedule = {...schedule, nights: updatedNights};
        console.error('body: ', updatedSchedule);
        return {responseCode: 200, body: updatedSchedule};
    } catch (e){
        return {error: e, devMessage: 'THERE WAS AN ERROR'};
    }
};