require('dotenv').config();
const generateFridayNightBattleSchedule = require('./generateFridayNightBattleSchedule/generateFridayNightBattleSchedule');
const S3Client = require('s3Client').S3Client;

const AWS_ACCESS_ID = process.env.AWS_ACCESS_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const s3Client = new S3Client(AWS_ACCESS_ID, AWS_SECRET_KEY);

exports.handler = async function (event, context) {
    const item = await s3Client.getObject();
    const schedule = await generateFridayNightBattleSchedule.generateFridayNightBattleSchedule(item.completedApplications);
    return;
}