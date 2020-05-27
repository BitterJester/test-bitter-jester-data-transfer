require('dotenv').config();
const generateFridayNightBattleSchedule = require('./generateFridayNightBattleSchedule/generateFridayNightBattleSchedule');
const S3Client = require('s3Client').S3Client;

const s3Client = new S3Client();
const s3Bucket = 'bitter-jester-test';

exports.handler = async function (event, context) {
    const item = await s3Client.getObject();
    const schedule = await generateFridayNightBattleSchedule.generateFridayNightBattleSchedule(item.completedApplications);
    const s3PutRequest = s3Client.createPutPublicJsonRequest(
        s3Bucket,
        'friday-night-schedule.json',
        JSON.stringify(schedule)
    );
    await s3Client.put(s3PutRequest);
};