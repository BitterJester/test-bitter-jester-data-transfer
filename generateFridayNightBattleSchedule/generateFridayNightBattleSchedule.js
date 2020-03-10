const _ = require('lodash');

function generateFridayNightBattleSchedule(completedApplications){
    const getAvailableBandsForNight = (fridayNightChoice) => {
        return completedApplications.filter(app => app.firstChoiceFridayNight.includes(fridayNightChoice));
    }

    const fullyAvailableBands = completedApplications.filter(app => app.isBandAvailableOnAllFridays);

    const firstChoiceNightOne = getAvailableBandsForNight('5');
    const firstChoiceNightTwo = getAvailableBandsForNight('12');
    const firstChoiceNightThree = getAvailableBandsForNight('19');
    const firstChoiceNightFour = getAvailableBandsForNight('26');
    
    const schedule = {
      fridayNightOne: firstChoiceNightOne,
      fridayNightTwo: firstChoiceNightTwo,
      fridayNightThree: firstChoiceNightThree,
      fridayNightFour: firstChoiceNightFour
    };

    Object.values(schedule).forEach(nightSchedule => {
        while(nightSchedule.length < 6){
            if(fullyAvailableBands.length === 0){
                break;
            } else {
                nightSchedule.push(fullyAvailableBands.pop());
            }
        }
    });

    return schedule;
}

module.exports = {
    generateFridayNightBattleSchedule: generateFridayNightBattleSchedule
}