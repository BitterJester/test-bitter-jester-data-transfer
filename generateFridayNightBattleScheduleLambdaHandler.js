require('dotenv').config();
const generateFridayNightBattleSchedule = require('./generateFridayNightBattleSchedule/generateFridayNightBattleSchedule');
const S3Client = require('s3Client').S3Client;

const s3Client = new S3Client();
const s3Bucket = 'bitter-jester-test';

exports.handler = async function (event, context) {
    try {
        const competition = event.competitionId ? `competition=${event.competitionId}` : event.Records[0].Sns.Message;
        const SUGGESTED_SCHEDULE_TYPE = 'friday-night-schedule';
        const LAST_SAVED_SCHEDULE_TYPE = 'user-friday-night-schedule';
        const scheduleType = event.lastSaved ? LAST_SAVED_SCHEDULE_TYPE : SUGGESTED_SCHEDULE_TYPE;
        const orderedShowcaseBands = event.orderedShowcaseBands ? event.orderedShowcaseBands.split(',') : [];
        if(scheduleType === SUGGESTED_SCHEDULE_TYPE){
            const item = await s3Client.getObject(s3Bucket, `${competition}/completed-submissions.json`);
            const removedBands = await s3Client.getObject(s3Bucket, `${competition}/removed-bands.json`);
            console.error(removedBands);
            const applications = item.completedApplications.filter(app => !removedBands.removedBands.includes(app.bandName));
            const schedule = await generateFridayNightBattleSchedule.generateFridayNightBattleSchedule(applications, orderedShowcaseBands);
            const s3PutRequest = s3Client.createPutPublicJsonRequest(
                s3Bucket,
                `${competition}/friday-night-schedule.json`,
                JSON.stringify(schedule)
            );
            await s3Client.put(s3PutRequest);
            return {responseCode: 200, body: schedule};
        }
        const lastSavedSchedule = await s3Client.getObject(s3Bucket, `${competition}/${LAST_SAVED_SCHEDULE_TYPE}.json`);
        return {responseCode: 200, body: lastSavedSchedule};
    } catch (e) {
        return e;
    }
};
