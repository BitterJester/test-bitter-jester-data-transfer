require('dotenv').config();
const generateFridayNightBattleSchedule = require('./generateFridayNightBattleSchedule/generateFridayNightBattleSchedule');

exports.handler = async function(event, context) {
    await generateFridayNightBattleSchedule.generateFridayNightBattleSchedule();
}