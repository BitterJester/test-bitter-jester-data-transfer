require('dotenv').config();
const generateFridayNightBattleSchedule = require('./generateFridayNightBattleSchedule/generateFridayNightBattleSchedule');
const S3Client = require('s3Client').S3Client;

const s3Client = new S3Client();
const s3Bucket = 'bitter-jester-test';

exports.handler = async function (event, context) {
    const competition = event.Records[0].Sns.Message;
    const item = await s3Client.getObject(s3Bucket, `${competition}/completed-submissions.json`);
    const previousFridayNightSchedule = await s3Client.getObject(s3Bucket, `${competition}/friday-night-schedule.json`);
    const schedule = await generateFridayNightBattleSchedule.generateFridayNightBattleSchedule(item.completedApplications, previousFridayNightSchedule);
    const s3PutRequest = s3Client.createPutPublicJsonRequest(
        s3Bucket,
        `${competition}/friday-night-schedule.json`,
        JSON.stringify(schedule)
    );
    await s3Client.put(s3PutRequest);
};
