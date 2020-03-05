require('dotenv').config();
const generateFridayNightSchedule = require('./generateFridayNightBattleSchedule/generateFridayNightBattleSchedule');

exports.handler = async function(event) {
    await generateFridayNightSchedule.generateFridayNightSchedule();
}